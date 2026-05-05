/**
 * POST /api/analyze
 * Analyse un texte libre via l'API Claude pour extraire les entités médicales.
 */

import { defineEventHandler, readBody, createError } from 'h3'

interface AnalyzeBody {
  text: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<AnalyzeBody>(event)

  if (!body?.text || body.text.trim().length < 3) {
    throw createError({ statusCode: 400, message: 'Le texte est trop court.' })
  }

  const config = useRuntimeConfig()

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.mistralApiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant médical spécialisé en extraction d'entités médicales (NLP médical).
Analyse le texte du patient et retourne UNIQUEMENT un objet JSON valide, sans markdown ni explication.

Format attendu :
{
  "entities": [
    { "text": "...", "label": "SYMPTOM|DISEASE|MEDICATION|ANATOMY|VALUE", "confidence": 0.95 }
  ],
  "symptoms_detected": ["symptôme1", "symptôme2"],
  "urgency_hint": "low|medium|high"
}

Règles de labellisation :
- SYMPTOM : douleur, fièvre, nausée, vertige, essoufflement, etc.
- DISEASE : nom d'une maladie identifiée
- MEDICATION : médicament mentionné par le patient
- ANATOMY : partie du corps concernée
- VALUE : température, durée, intensité chiffrée

Règles urgency_hint :
- "high"   → douleur thoracique, perte de conscience, hémorragie, suspicion AVC, convulsions, fièvre ≥ 40°C
- "medium" → fièvre 38.5–39.9°C, vomissements répétés, douleur abdominale intense, aggravation rapide
- "low"    → tout le reste`
          },
          {
            role: 'user',
            content: `Analyse ce texte médical et retourne le JSON : "${body.text}"`
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`)
    }

    const mistralData = await response.json()
    const rawText = mistralData.choices?.[0]?.message?.content || '{}'

    // Nettoyage et parse du JSON retourné par Claude
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      entities: parsed.entities || [],
      symptoms_detected: parsed.symptoms_detected || [],
      urgency_hint: parsed.urgency_hint || 'low',
      raw_text: body.text
    }

  } catch (error: any) {
    console.error('[Mistral NLP] Analyze error:', error.message)
    return {
      entities: [],
      symptoms_detected: [],
      urgency_hint: 'low',
      raw_text: body.text,
      fallback: true,
      error: 'Analyse NLP indisponible — mode règles actif'
    }
  }
})
