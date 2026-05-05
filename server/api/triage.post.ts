/**
 * POST /api/triage
 * Calcule l'orientation médicale via Claude + scoring questionnaire.
 */

import { defineEventHandler, readBody, createError } from 'h3'

interface TriageBody {
    free_text?: string
    questionnaire: Record<string, string | number>
}

interface PisteDetails {
    typical_duration?: string
    treatment?: string
    when_to_consult?: string
    warning_signs?: string
}

interface Piste {
    name: string
    desc: string
    source: 'claude' | 'rules'
    urgent?: boolean
    confidence?: number
    details?: PisteDetails
}

export default defineEventHandler(async (event) => {
    const body = await readBody<TriageBody>(event)

    if (!body?.questionnaire) {
        throw createError({ statusCode: 400, message: 'Questionnaire manquant.' })
    }

    const answers = body.questionnaire
    let score = 0
    const flags: string[] = []
    let pistesFromClaude: Piste[] = []

    // ══════════════════════════════════════════════
    // 1. ANALYSE CLAUDE (texte libre + questionnaire)
    // ══════════════════════════════════════════════
    const config = useRuntimeConfig()

    try {
        // Construire un résumé lisible du questionnaire pour Claude
        const questionnaireText = Object.entries(answers)
            .filter(([k]) => k !== 'free_text')
            .map(([k, v]) => `- ${k}: ${v}`)
            .join('\n')

        const fullContext = body.free_text
            ? `Texte libre du patient : "${body.free_text}"\n\nRéponses au questionnaire :\n${questionnaireText}`
            : `Réponses au questionnaire :\n${questionnaireText}`

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.mistralApiKey}`,
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'system',
                        content: `Tu es un assistant médical d'aide à l'orientation.
Tu analyses les symptômes d'un patient et proposes des pistes médicales à explorer avec un médecin.
Tu retournes UNIQUEMENT un objet JSON valide, sans markdown ni explication.

Format attendu :
{
  "pistes": [
    {
      "name": "Nom de la pathologie ou cause possible",
      "desc": "Brève explication en 1 phrase pourquoi cette piste est pertinente",
      "confidence": 0.85,
      "urgent": false,
      "details": {
        "typical_duration": "Durée typique de la condition",
        "treatment": "Principes de traitement généraux",
        "when_to_consult": "Quand il est recommandé de consulter",
        "warning_signs": "Signes d'alerte à surveiller",
        "googleSearchQuery": "Nom de la pathologie pour recherche Google"
      }
    }
  ],
  "score_adjustment": 0,
  "flags_from_nlp": []
}

Règles :
- Propose 2 à 4 pistes maximum, les plus pertinentes selon le profil complet
- "urgent: true" uniquement si la piste nécessite une prise en charge immédiate
- "confidence" entre 0 et 1 selon la probabilité estimée
- "score_adjustment" : nombre entre -20 et +30 à ajouter au score de triage si des éléments du texte libre aggravent ou allègent la situation
- "flags_from_nlp" : liste de signaux importants détectés dans le texte libre (ex: "mentionne douleur irradiant dans le bras gauche")
- Rappel : tu ne poses PAS de diagnostic, tu proposes des pistes à explorer`,
                    },
                    {
                        role: 'user',
                        content: fullContext,
                    },
                ],
            }),
        })

        if (response.ok) {
            const mistralData = await response.json()
            const rawText = mistralData.choices?.[0]?.message?.content || '{}'
            const cleaned = rawText.replace(/```json|```/g, '').trim()
            const parsed = JSON.parse(cleaned)

            pistesFromClaude = (parsed.pistes || []).map((p: any) => ({
                name: p.name || 'Unknown',
                desc: p.desc || '',
                source: 'claude' as const,
                urgent: p.urgent || false,
                confidence: p.confidence || 0.5,
                details: p.details || null,
            }))

            // Appliquer l'ajustement de score suggéré par Claude
            if (parsed.score_adjustment) {
                score += Math.max(-20, Math.min(30, parsed.score_adjustment))
            }

            // Ajouter les flags détectés par Claude
            if (parsed.flags_from_nlp?.length) {
                flags.push(...parsed.flags_from_nlp)
            }
        }
    } catch (error: any) {
        console.error('[Mistral] Triage NLP error:', error.message)
        // Continuer sans Claude — fallback règles
    }

    // ══════════════════════════════════════════════
    // 2. SCORING QUESTIONNAIRE STRUCTURÉ
    // ══════════════════════════════════════════════

    if (answers.alarm_signs && answers.alarm_signs !== 'none_alarm') {
        return {
            level: 'urgence',
            score: 100,
            flags: ["Signe d'alarme critique détecté", ...flags],
            pistes: [
                ...pistesFromClaude,
                {
                    name: 'Pathologie aiguë sévère',
                    desc: "Prise en charge d'urgence immédiate requise",
                    source: 'rules',
                    urgent: true,
                },
            ],
            summary: 'Consultez aux urgences sans attendre ou appelez le 15 (SAMU).',
        }
    }

    if (answers.chief_complaint === 'chest') {
        score += 40
        flags.push('Douleur thoracique')
    }
    if (answers.chief_complaint === 'head') {
        score += 20
        flags.push('Céphalées intenses')
    }
    if (answers.duration === 'hours') score += 20
    if (answers.duration === 'days_3') score += 10

    const sev = Number(answers.severity) || 5
    if (sev >= 8) {
        score += 25
        flags.push(`Douleur intense (${sev}/10)`)
    } else if (sev >= 5) score += 12

    if (answers.worsening === 'worse') {
        score += 15
        flags.push('Aggravation des symptômes')
    }
    if (answers.fever_temp === 'very_high_fever') {
        score += 30
        flags.push('Fièvre ≥ 40°C')
    }
    if (answers.fever_temp === 'high_fever') {
        score += 15
        flags.push('Fièvre élevée')
    }
    if (answers.chronic === 'cardiac_diabetes') {
        score += 15
        flags.push('Antécédent cardiaque/diabète')
    }
    if (answers.chronic === 'respiratory') {
        score += 10
        flags.push('Antécédent respiratoire')
    }
    if (answers.consulted === 'no_improvement') {
        score += 10
        flags.push("Absence d'amélioration")
    }

    const age = Number(answers.identity_age) || 30
    if (age >= 70) {
        score += 10
        flags.push('Patient âgé (≥ 70 ans)')
    }
    if (age < 2) {
        score += 15
        flags.push('Nourrisson (< 2 ans)')
    }

    // ══════════════════════════════════════════════
    // 3. PISTES RÈGLES (complément si Claude insuffisant)
    // ══════════════════════════════════════════════
    const pistesRules = computeRulesPistes(answers)
    const allPistes: Piste[] = [
        ...pistesFromClaude,
        ...pistesRules.slice(0, Math.max(0, 4 - pistesFromClaude.length)),
    ]

    // ══════════════════════════════════════════════
    // 4. DÉCISION FINALE
    // ══════════════════════════════════════════════
    const level = score >= 55 ? 'urgence' : score >= 25 ? 'rapide' : 'standard'

    const summaryMap: Record<string, string> = {
        urgence: 'Consultez aux urgences sans attendre ou appelez le 15 (SAMU).',
        rapide: 'Consultez un médecin dans les 24 à 48 heures.',
        standard: 'Prenez rendez-vous avec votre médecin dans les prochains jours.',
    }

    return { level, score, flags, pistes: allPistes, summary: summaryMap[level] }
})

// ── Fallback règles
function computeRulesPistes(answers: Record<string, string | number>): Piste[] {
    const cc = String(answers.chief_complaint || '')
    const loc = String(answers.pain_location || '')
    const sev = Number(answers.severity) || 0
    const pistes: Piste[] = []

    if (cc === 'fever') {
        pistes.push({
            name: 'Infection virale (grippe, Covid-19…)',
            desc: 'Fièvre + fatigue — fréquent',
            source: 'rules',
            details: {
                typical_duration: '5-10 jours',
                treatment: 'Repos, hydratation, antipyrétiques',
                when_to_consult: 'Si fièvre > 3 jours ou difficultés respiratoires',
                warning_signs: 'Confusion, douleur thoracique persistante',
                googleSearchQuery: 'grippe symptômes traitement'
            }
        })
        pistes.push({
            name: 'Infection bactérienne',
            desc: 'Si fièvre persistante > 3 jours',
            source: 'rules',
            details: {
                typical_duration: '7-14 jours sans traitement',
                treatment: 'Antibiotiques sur prescription médicale',
                when_to_consult: 'Si fièvre élevée persistante, mal de gorge sévère',
                warning_signs: 'Déglutition difficile, bave, fièvre > 39°C',
                googleSearchQuery: 'infection bactérienne symptômes'
            }
        })
    }
    if (cc === 'head' || loc === 'head_neck') {
        pistes.push({
            name: 'Céphalée de tension',
            desc: 'Liée au stress ou à la fatigue',
            source: 'rules',
            details: {
                typical_duration: '30 min à 7 jours',
                treatment: 'Repos, gestion du stress, antalgiques',
                when_to_consult: 'Si maux de tête fréquence augmentée',
                warning_signs: 'Mal de tête soudain "en coup de tonnerre", problèmes de vision',
                googleSearchQuery: 'céphalée tension symptômes traitement'
            }
        })
        if (sev >= 7)
            pistes.push({
                name: 'Migraine',
                desc: 'Douleur pulsatile, photophobie possible',
                source: 'rules',
                details: {
                    typical_duration: '4-72 heures',
                    treatment: 'Triptans, repos dans une pièce sombre',
                    when_to_consult: 'Si nouveaux symptômes ou fréquence augmentée',
                    warning_signs: 'Maux de tête différents des habitudes, neurologiques',
                    googleSearchQuery: 'migraine symptômes traitement'
                }
            })
    }
    if (cc === 'abdomen') {
        pistes.push({
            name: 'Gastro-entérite virale',
            desc: 'Douleurs + nausées — bénigne',
            source: 'rules',
            details: {
                typical_duration: '1-3 jours',
                treatment: 'Hydratation, régime bland, repos',
                when_to_consult: 'Si sang dans les selles, déshydratation sévère',
                warning_signs: 'Sang dans les selles, diarrhée sanglante',
                googleSearchQuery: 'gastro-entérite virale symptômes traitement'
            }
        })
        pistes.push({
            name: 'Troubles digestifs',
            desc: 'Ballonnements, constipation',
            source: 'rules',
            details: {
                typical_duration: 'Variable, souvent lié à l\'alimentation',
                treatment: 'Ajustements diététiques, repas réguliers',
                when_to_consult: 'Si symptômes persistent > 2 semaines',
                warning_signs: 'Perte de poids inexpliquée, sang dans les selles',
                googleSearchQuery: 'troubles digestifs symptômes traitement'
            }
        })
    }
    if (cc === 'chest' || loc === 'chest_thorax') {
        pistes.push({
            name: 'Douleur musculo-squelettique',
            desc: 'Aggravée par les mouvements',
            source: 'rules',
            details: {
                typical_duration: '1-2 semaines',
                treatment: 'Repos, glace, étirements doux',
                when_to_consult: 'Si douleur sévère ou ne s\'améliore pas',
                warning_signs: 'Douleur thoracique au repos, irradiant vers le bras',
                googleSearchQuery: 'douleur thoracique muscles symptômes'
            }
        })
        pistes.push({
            name: 'Reflux gastro-œsophagien',
            desc: 'Brûlures après les repas',
            source: 'rules',
            details: {
                typical_duration: 'Peut être chronique',
                treatment: 'IPP, changements alimentaires, surélever la tête du lit',
                when_to_consult: 'Si brûlures persistent > 2 semaines',
                warning_signs: 'Douleur thoracique, difficultés à avaler',
                googleSearchQuery: 'reflux gastro-œsophagien symptômes traitement'
            }
        })
    }
    if (cc === 'pain' || loc === 'back') {
        pistes.push({
            name: 'Contracture musculaire',
            desc: 'Effort ou mauvaise posture',
            source: 'rules',
            details: {
                typical_duration: '3-7 jours',
                treatment: 'Repos, chaleur, anti-inflammatoires',
                when_to_consult: 'Si douleur persiste au-delà de 2 semaines',
                warning_signs: 'Fourmillement, faiblesse dans le bras/jambe',
                googleSearchQuery: 'contracture musculaire traitement'
            }
        })
        pistes.push({
            name: 'Lombalgie / Hernie discale',
            desc: 'Douleur lombaire possible',
            source: 'rules',
            details: {
                typical_duration: '1-4 semaines pour douleur aiguë',
                treatment: 'Rester actif, éviter le repos au lit, kinésithérapie',
                when_to_consult: 'Si douleur irradie vers la jambe, engourdissement',
                warning_signs: 'Perte de contrôle de la vessie, fièvre',
                googleSearchQuery: 'lombalgie hernie discale symptômes'
            }
        })
    }
    if (!pistes.length) {
        pistes.push({
            name: 'Syndrome viral non spécifique',
            desc: 'Symptômes diffus sans signe majeur',
            source: 'rules',
            details: {
                typical_duration: '3-7 jours',
                treatment: 'Repos, hydratation, soulagement des symptômes',
                when_to_consult: 'Si symptômes s\'aggravent ou ne s\'améliorent pas après 1 semaine',
                warning_signs: 'Fièvre élevée, difficultés respiratoires',
                googleSearchQuery: 'syndrome viral symptômes traitement'
            }
        })
    }

    return pistes.slice(0, 4)
}