import type { Answers, TriageResult, Piste } from '~/types'

export const useTriage = () => {

  const computeLocal = (answers: Answers): TriageResult => {
    let score = 0
    const flags: string[] = []

    if (answers.alarm_signs && answers.alarm_signs !== 'none_alarm') {
      return {
        level: 'urgence', score: 100,
        flags: ["Signe d'alarme critique détecté"],
        pistes: [{ name: 'Pathologie aiguë sévère', desc: "Évaluation médicale d'urgence requise immédiatement", source: 'rules', urgent: true }],
        summary: 'Consultez aux urgences sans attendre ou appelez le 15.'
      }
    }

    if (answers.chief_complaint === 'chest') { score += 40; flags.push('Douleur thoracique') }
    if (answers.chief_complaint === 'head')  { score += 20; flags.push('Céphalées intenses') }
    if (answers.duration === 'hours')  score += 20
    if (answers.duration === 'days_3') score += 10

    const sev = Number(answers.severity) || 5
    if (sev >= 8)      { score += 25; flags.push(`Douleur intense (${sev}/10)`) }
    else if (sev >= 5) score += 12

    if (answers.worsening === 'worse')          { score += 15; flags.push('Aggravation des symptômes') }
    if (answers.fever_temp === 'very_high_fever'){ score += 30; flags.push('Fièvre ≥ 40°C') }
    if (answers.fever_temp === 'high_fever')     { score += 15; flags.push('Fièvre élevée') }
    if (answers.chronic === 'cardiac_diabetes')  { score += 15; flags.push('Antécédent cardiaque/diabète') }
    if (answers.chronic === 'respiratory')       { score += 10; flags.push('Antécédent respiratoire') }
    if (answers.consulted === 'no_improvement')  { score += 10; flags.push("Absence d'amélioration") }

    const age = Number(answers.identity_age) || 30
    if (age >= 70) { score += 10; flags.push('Patient âgé (≥ 70 ans)') }
    if (age < 2)   { score += 15; flags.push('Nourrisson (< 2 ans)') }

    const level = score >= 55 ? 'urgence' : score >= 25 ? 'rapide' : 'standard'
    const pistes = computeLocalPistes(answers, level)

    const summaryMap = {
      urgence:  'Consultez aux urgences sans attendre ou appelez le 15.',
      rapide:   'Consultez un médecin dans les 24 à 48 heures.',
      standard: 'Prenez rendez-vous avec votre médecin dans les prochains jours.'
    }

    return { level, score, flags, pistes, summary: summaryMap[level] }
  }

  const computeLocalPistes = (answers: Answers, level: string): Piste[] => {
    const cc  = answers.chief_complaint as string
    const loc = answers.pain_location as string
    const sev = Number(answers.severity) || 0
    const pistes: Piste[] = []

    if (level === 'urgence') {
      if (cc === 'chest') pistes.push({ name: 'Syndrome coronarien aigu', desc: 'Douleur thoracique urgente — urgence cardiologique', source: 'rules', urgent: true })
      pistes.push({ name: 'Pathologie aiguë sévère', desc: "Évaluation d'urgence requise", source: 'rules', urgent: true })
      return pistes
    }

    if (cc === 'fever') {
      pistes.push({ name: 'Infection virale (grippe, Covid-19…)', desc: 'Fièvre + fatigue — fréquent en hiver', source: 'rules' })
      pistes.push({ name: 'Infection bactérienne (angine, sinusite)', desc: 'Si fièvre persistante > 3 jours', source: 'rules' })
    }
    if (cc === 'head' || loc === 'head_neck') {
      pistes.push({ name: 'Céphalée de tension', desc: 'Liée au stress ou à la fatigue', source: 'rules' })
      if (sev >= 7) pistes.push({ name: 'Migraine', desc: 'Douleur pulsatile, photophobie possible', source: 'rules' })
    }
    if (cc === 'abdomen' || loc === 'abdomen') {
      pistes.push({ name: 'Gastro-entérite virale', desc: 'Douleurs + nausées/diarrhée — bénigne', source: 'rules' })
      pistes.push({ name: 'Troubles digestifs', desc: 'Ballonnements, constipation', source: 'rules' })
    }
    if (cc === 'chest' || loc === 'chest_thorax') {
      pistes.push({ name: 'Douleur musculo-squelettique', desc: 'Aggravée par les mouvements', source: 'rules' })
      pistes.push({ name: 'Reflux gastro-œsophagien', desc: 'Brûlures après les repas', source: 'rules' })
    }
    if (cc === 'pain' || loc === 'back') {
      pistes.push({ name: 'Contracture musculaire', desc: 'Effort ou mauvaise posture', source: 'rules' })
      pistes.push({ name: 'Lombalgie / Hernie discale', desc: 'Douleur lombaire possible', source: 'rules' })
    }
    if (!pistes.length) {
      pistes.push({ name: 'Syndrome viral non spécifique', desc: 'Ensemble de symptômes diffus sans signe majeur', source: 'rules' })
    }

    return pistes.slice(0, 4)
  }

  const fetchTriage = async (freeText: string, answers: Answers): Promise<TriageResult> => {
    const data = await $fetch<TriageResult>('/api/triage', {
      method: 'POST',
      body: { free_text: freeText, questionnaire: answers }
    })
    return data
  }

  const fetchAnalyze = async (text: string) => {
    const data = await $fetch('/api/analyze', {
      method: 'POST',
      body: { text }
    })
    return data
  }

  return { computeLocal, fetchTriage, fetchAnalyze }
}