<script setup lang="ts">
import type { TriageResult, Answers } from '~/types'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  result: TriageResult
  answers: Answers
}>()

const emit = defineEmits<{ restart: [] }>()

const { locale, t } = useLocale()

const levelConfig = computed(() => {
  if (locale.value === 'en') {
    return {
      urgence: {
        label: 'EMERGENCY',
        title: 'Consult the emergency department immediately',
        explanation: "Your responses indicate symptoms requiring immediate care. Call 15 (SAMU) or go to the emergency department now.",
        steps: [
          "Call 15 (SAMU) if you cannot travel",
          "Go to the nearest emergency department",
          "Do not drive alone if you feel very bad",
          "Present this summary to medical staff"
        ],
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        badgeColor: 'bg-red-100 text-red-700',
        dotColor: 'bg-red-500',
      },
      rapide: {
        label: 'QUICK CONSULTATION',
        title: 'See a doctor within 24 to 48 hours',
        explanation: "Your symptoms deserve medical attention soon. Contact your GP or an emergency medical center.",
        steps: [
          "Call your GP today",
          "Outside hours, consult an emergency medical center",
          "Monitor your symptoms",
          "Call 15 if your condition worsens"
        ],
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-700',
        badgeColor: 'bg-orange-100 text-orange-700',
        dotColor: 'bg-orange-500',
      },
      standard: {
        label: 'NON-URGENT CONSULTATION',
        title: 'See a doctor in the coming days',
        explanation: "Your symptoms require medical follow-up but without urgent character. Make an appointment with your doctor.",
        steps: [
          "Make an appointment with your GP",
          "Note daily evolution of your symptoms",
          "Rest and stay hydrated",
          "Come back to MediGuide if your condition changes"
        ],
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        dotColor: 'bg-emerald-500',
      }
    }
  }
  return {
    urgence: {
      label: 'URGENCE',
      title: 'Consultez aux urgences sans attendre',
      explanation: "Vos réponses indiquent des symptômes nécessitant une prise en charge immédiate. Appelez le 15 (SAMU) ou rendez-vous aux urgences maintenant.",
      steps: [
        "Appelez le 15 (SAMU) si vous ne pouvez pas vous déplacer",
        "Rendez-vous aux urgences les plus proches",
        "Ne conduisez pas seul si vous vous sentez très mal",
        "Présentez ce résumé au personnel médical"
      ],
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100 text-red-700',
      dotColor: 'bg-red-500',
    },
    rapide: {
      label: 'CONSULTATION RAPIDE',
      title: 'Consultez un médecin sous 24 à 48h',
      explanation: "Vos symptômes meritent une attention médicale prochaine. Contactez votre médecin traitant ou une maison médicale de garde.",
      steps: [
        "Appelez votre médecin traitant dès aujourd'hui",
        "En dehors des heures, consultez une maison médicale de garde",
        "Surveillez l'évolution de vos symptômes",
        "Appelez le 15 si votre état s'aggrave"
      ],
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      badgeColor: 'bg-orange-100 text-orange-700',
      dotColor: 'bg-orange-500',
    },
    standard: {
      label: 'CONSULTATION NON URGENTE',
      title: 'Consultez dans les prochains jours',
      explanation: "Vos symptômes nécessitent un suivi médical mais sans caractère urgent. Prenez rendez-vous avec votre médecin.",
      steps: [
        "Prenez rendez-vous avec votre médecin traitant",
        "Notez l'évolution quotidienne de vos symptômes",
        "Reposez-vous et hydratez-vous correctement",
        "Revenez sur MediGuide si votre état change"
      ],
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      dotColor: 'bg-emerald-500',
    }
  }
})

const config = computed(() => levelConfig.value[props.result.level])

const summaryLabels = computed(() => {
  if (locale.value === 'en') {
    return {
      identity_age: 'Age', identity_gender: 'Gender',
      chief_complaint: 'Main symptom', pain_location: 'Location',
      duration: 'Duration', severity: 'Intensity (/10)', worsening: 'Evolution',
      fever_temp: 'Fever', alarm_signs: 'Warning signs', chronic: 'Medical history',
      allergies: 'Allergies', self_medication: 'Medications taken', consulted: 'Previous consultation',
      free_text: 'Free description'
    }
  }
  return {
    identity_age: 'Âge', identity_gender: 'Sexe',
    chief_complaint: 'Symptôme principal', pain_location: 'Localisation',
    duration: 'Durée', severity: 'Intensité (/10)', worsening: 'Évolution',
    fever_temp: 'Fièvre', alarm_signs: "Signes d'alarme", chronic: 'Antécédents',
    allergies: 'Allergies', self_medication: 'Médicaments pris', consulted: 'Consultation préalable',
    free_text: 'Description libre'
  }
})

const valueLabels = computed(() => {
  if (locale.value === 'en') {
    return {
      fever: 'Fever/Chills', chest: 'Chest pain', abdomen: 'Abdominal pain',
      head: 'Headache', nausea: 'Nausea', pain: 'Localized pain',
      wound: 'Wound/Injury', other: 'Other',
      hours: '< Few hours', days_3: '1–3 days', days_7: '4–7 days', weeks: '> 1 week',
      worse: 'Worsening', stable: 'Stable', better: 'Improving',
      no_fever: 'No fever', low_fever: 'Mild', high_fever: 'Moderate/High', very_high_fever: '≥ 40°C',
      none: 'None', cardiac_diabetes: 'Heart/Diabetes', respiratory: 'Respiratory', other_chronic: 'Other',
      consciousness: 'Loss of consciousness', bleeding: 'Bleeding', breathing: 'Breathing difficulties', none_alarm: 'None',
      first_time: 'First time', follow_up: 'Ongoing follow-up', no_improvement: 'Without improvement',
      no_allergy: 'None', drug_allergy: 'Drug', food_allergy: 'Food', other_allergy: 'Other',
      nothing: 'None', analgesic: 'Analgesic/Antipyretic', antibiotic: 'Antibiotic', other_meds: 'Other',
      male: 'Male', female: 'Female', other_gender: 'Other',
      head_neck: 'Head/Neck', chest_thorax: 'Thorax', heart: 'Heart', arm_shoulder: 'Arm/Shoulder',
      leg_knee: 'Leg/Knee', foot_ankle: 'Foot/Ankle', back: 'Back/Spine', diffuse: 'Diffuse',
    }
  }
  return {
    fever: 'Fièvre/Frissons', chest: 'Douleur thoracique', abdomen: 'Douleur abdominale',
    head: 'Maux de tête', nausea: 'Nausées', pain: 'Douleur localisée',
    wound: 'Plaie/Blessure', other: 'Autre',
    hours: '< Quelques heures', days_3: '1–3 jours', days_7: '4–7 jours', weeks: '> 1 semaine',
    worse: 'Aggravation', stable: 'Stable', better: 'Amélioration',
    no_fever: 'Pas de fièvre', low_fever: 'Légère', high_fever: 'Modérée/Élevée', very_high_fever: '≥ 40°C',
    none: 'Aucun', cardiac_diabetes: 'Cardiaque/Diabète', respiratory: 'Respiratoire', other_chronic: 'Autre',
    consciousness: 'Perte de conscience', bleeding: 'Saignement', breathing: 'Difficultés respiratoires', none_alarm: 'Aucun',
    first_time: 'Première fois', follow_up: 'Suivi en cours', no_improvement: 'Sans amélioration',
    no_allergy: 'Aucune', drug_allergy: 'Médicament', food_allergy: 'Alimentaire', other_allergy: 'Autre',
    nothing: 'Aucun', analgesic: 'Antalgique/Antipyrétique', antibiotic: 'Antibiotique', other_meds: 'Autre',
    male: 'Homme', female: 'Femme', other_gender: 'Autre',
    head_neck: 'Tête/Cou', chest_thorax: 'Thorax', heart: 'Cœur', arm_shoulder: 'Bras/Épaule',
    leg_knee: 'Jambe/Genou', foot_ankle: 'Pied/Cheville', back: 'Dos/Colonne', diffuse: 'Diffus',
  }
})

const summaryKeys = ['free_text','identity_age','identity_gender','chief_complaint','pain_location',
  'duration','severity','worsening','fever_temp','alarm_signs','chronic','allergies','self_medication','consulted']

const copied = ref(false)

const getShareText = () => {
  const isEn = locale.value === 'en'
  const sep = isEn ? '━━━━━━━━━━━━━━━━━━━━━━' : '━━━━━━━━━━━━━━━━━━━━━━'
  const bullet = '•'
  
  let text = `${isEn ? '' : '🏥 MediGuide - Résumé de santé\n'}${sep}\n`
  
  if (props.answers.identity_age) {
    const gender = props.answers.identity_gender ? valueLabels.value[String(props.answers.identity_gender)] || '' : ''
    text += `${isEn ? 'Patient' : 'Patient'}: ${props.answers.identity_age} ${gender}\n`
  }
  
  for (const key of summaryKeys) {
    if (key === 'identity_age' || key === 'identity_gender' || key === 'free_text') continue
    if (props.answers[key] !== undefined) {
      const label = summaryLabels.value[key] || key
      const val = valueLabels.value[String(props.answers[key])] || String(props.answers[key])
      text += `${label}: ${val}\n`
    }
  }
  
  text += `${sep}\n`
  text += `${isEn ? '📊 Level' : '📊 Niveau'}: ${config.value.label}\n`
  text += `→ ${config.value.title}\n`
  
  if (props.result.flags.length) {
    text += `\n${isEn ? '⚠️ Factors' : '⚠️ Facteurs'}: ${props.result.flags.join(', ')}\n`
  }
  
  if (props.result.pistes.length) {
    text += `\n${isEn ? '📋 Possible causes' : '📋 Pistes à explorer'}:\n`
    for (const piste of props.result.pistes) {
      text += `${bullet} ${piste.name}\n`
    }
  }
  
  text += `${sep}\n`
  text += `${isEn 
    ? '⚠️ Indicative only, not medical advice. Call 15 in case of emergency.'
    : '⚠️ Indicatif, pas un avis médical. Appelez le 15 en cas d\'urgence.'}\n`
  
  return text
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(getShareText())
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = getShareText()
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}

const shareResult = async () => {
  const text = getShareText()
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'MediGuide',
        text: text
      })
    } catch {}
  } else {
    copyToClipboard()
  }
}

const printResult = () => {
  window.print()
}

const getPisteTips = (piste: any): string[] => {
  if (piste.details) {
    const d = piste.details
    const isEn = locale.value === 'en'
    const tips: string[] = []
    if (d.typical_duration) tips.push(isEn ? `Duration: ${d.typical_duration}` : `Durée: ${d.typical_duration}`)
    if (d.treatment) tips.push(isEn ? `Treatment: ${d.treatment}` : `Traitement: ${d.treatment}`)
    if (d.when_to_consult) tips.push(isEn ? `When to consult: ${d.when_to_consult}` : `Quand consulter: ${d.when_to_consult}`)
    if (d.warning_signs) tips.push(isEn ? `Warning signs: ${d.warning_signs}` : `Signes d'alerte: ${d.warning_signs}`)
    return tips
  }
  if (pisteDetails[piste.name]) {
    return pisteDetails[piste.name].tips
  }
  return []
}

const getPisteDocUrl = (piste: any): string | null => {
  if (piste.details?.googleSearchQuery) {
    const query = encodeURIComponent(piste.details.googleSearchQuery)
    return `https://www.google.com/search?q=${query}`
  }
  return null
}

const expandedPistes = ref<Set<string>>(new Set())

const togglePiste = (name: string) => {
  if (expandedPistes.value.has(name)) {
    expandedPistes.value.delete(name)
  } else {
    expandedPistes.value.add(name)
  }
}

const pisteDetails = computed(() => {
  const isEn = locale.value === 'en'
  return {
    'Contracture musculaire': {
      title: isEn ? 'Muscle strain' : 'Contracture musculaire',
      tips: isEn ? [
        'Typical duration: 3-7 days',
        'Treatment: Rest, heat, anti-inflammatories',
        'When to consult: If pain persists beyond 2 weeks',
        'Warning signs: Numbness, weakness in arm/leg'
      ] : [
        'Durée typique: 3-7 jours',
        'Traitement: Repos, chaleur, anti-inflammatoires',
        'Quand consulter: Si douleur persiste au-delà de 2 semaines',
        'Signes d\'alerte: Fourmillement, faiblesse dans le bras/jambe'
      ]
    },
    'Lombalgie / Hernie discale': {
      title: isEn ? 'Lower back pain / Disc hernia' : 'Lombalgie / Hernie discale',
      tips: isEn ? [
        'Typical duration: 1-4 weeks for acute pain',
        'Treatment: Stay active, avoid bed rest, physiotherapy',
        'When to consult: If pain radiates to leg, numbness',
        'Warning signs: Loss of bladder control, fever'
      ] : [
        'Durée typique: 1-4 semaines pour douleur aiguë',
        'Traitement: Rester actif, éviter le repos au lit, kinésithérapie',
        'Quand consulter: Si douleur irradie vers la jambe, engourdissement',
        'Signes d\'alerte: Perte de contrôle de la vessie, fièvre'
      ]
    },
    'Céphalée de tension': {
      title: isEn ? 'Tension headache' : 'Céphalée de tension',
      tips: isEn ? [
        'Typical duration: 30 min to 7 days',
        'Treatment: Rest, stress management, analgesics',
        'When to consult: If headaches increase in frequency',
        'Warning signs: Sudden "thunderclap" headache, vision problems'
      ] : [
        'Durée typique: 30 min à 7 jours',
        'Traitement: Repos, gestion du stress, antalgiques',
        'Quand consulter: Si les maux de tête augmentent en fréquence',
        'Signes d\'alerte: Mal de tête "en coup de tonnerre", problèmes de vision'
      ]
    },
    'Migraine': {
      title: isEn ? 'Migraine' : 'Migraine',
      tips: isEn ? [
        'Typical duration: 4-72 hours',
        'Triggers: Stress, certain foods, hormonal changes',
        'Treatment: Triptans, rest in dark room',
        'When to consult: If new symptoms or increased frequency'
      ] : [
        'Durée typique: 4-72 heures',
        'Facteurs déclenchants: Stress, certains aliments, changements hormonaux',
        'Traitement: Triptans, repos dans une pièce sombre',
        'Quand consulter: Si nouveaux symptômes ou fréquence augmentée'
      ]
    },
    'Gastro-entérite virale': {
      title: isEn ? 'Viral gastroenteritis' : 'Gastro-entérite virale',
      tips: isEn ? [
        'Typical duration: 1-3 days',
        'Risks: Dehydration, especially in young/elderly',
        'Treatment: Hydration, bland diet, rest',
        'When to consult: If blood in stool, severe dehydration'
      ] : [
        'Durée typique: 1-3 jours',
        'Risques: Déshydratation, surtout chez les jeunes/âgés',
        'Traitement: Hydratation, régime bland, repos',
        'Quand consulter: Si sang dans les selles, déshydratation sévère'
      ]
    },
    'Troubles digestifs': {
      title: isEn ? 'Digestive disorders' : 'Troubles digestifs',
      tips: isEn ? [
        'Typical duration: Variable, often related to diet',
        'Causes: Stress, food intolerances, irregular meals',
        'Treatment: Dietary adjustments, regular meals',
        'When to consult: If symptoms persist > 2 weeks'
      ] : [
        'Durée typique: Variable, souvent lié à l\'alimentation',
        'Causes: Stress, intolérances alimentaires, repas irréguliers',
        'Traitement: Ajustements diététiques, repas réguliers',
        'Quand consulter: Si symptômes persistent > 2 semaines'
      ]
    },
    'Douleur musculo-squelettique': {
      title: isEn ? 'Musculoskeletal pain' : 'Douleur musculo-squelettique',
      tips: isEn ? [
        'Typical duration: 1-2 weeks',
        'Causes: Overuse, poor posture, physical activity',
        'Treatment: Rest, ice, gentle stretching',
        'When to consult: If pain is severe or doesn\'t improve'
      ] : [
        'Durée typique: 1-2 semaines',
        'Causes: Surutilisation, mauvaise posture, activité physique',
        'Traitement: Repos, glace, étirements doux',
        'Quand consulter: Si douleur sévère ou ne s\'améliore pas'
      ]
    },
    'Reflux gastro-œsophagien': {
      title: isEn ? 'Gastroesophageal reflux' : 'Reflux gastro-œsophagien',
      tips: isEn ? [
        'Typical duration: Can be chronic',
        'Foods to avoid: Coffee, alcohol, spicy food, mint',
        'Treatment: PPIs, dietary changes, raise head of bed',
        'When to consult: If heartburn persists > 2 weeks'
      ] : [
        'Durée typique: Peut être chronique',
        'Aliments à éviter: Café, alcool, plats épicés, menthe',
        'Traitement: IPP, changements alimentaires, surélever la tête du lit',
        'Quand consulter: Si brûlures persistent > 2 semaines'
      ]
    },
    'Palpitations / Arythmie': {
      title: isEn ? 'Palpitations / Arrhythmia' : 'Palpitations / Arythmie',
      tips: isEn ? [
        'Typical duration: Variable',
        'Triggers: Stress, caffeine, alcohol, medications',
        'When to consult: If episodes are frequent or prolonged',
        'Warning signs: Chest pain, shortness of breath, fainting'
      ] : [
        'Durée typique: Variable',
        'Déclencheurs: Stress, caféine, alcool, médicaments',
        'Quand consulter: Si épisodes fréquents ou prolongés',
        'Signes d\'alerte: Douleur thoracique, essoufflement, syncope'
      ]
    },
    'Syndrome coronarien aigu': {
      title: isEn ? 'Acute coronary syndrome' : 'Syndrome coronarien aigu',
      tips: isEn ? [
        'Warning signs: Chest pain radiating to arm/jaw, sweating',
        'Emergency: Call 15 immediately',
        'Risk factors: Smoking, diabetes, hypertension, family history',
        'Do not ignore: Any chest pain that lasts > 5 minutes'
      ] : [
        'Signes d\'alerte: Douleur thoracique irradiant vers le bras/mâchoire, sueurs',
        'Urgence: Appelez le 15 immédiatement',
        'Facteurs de risque: Tabac, diabète, hypertension, antécédents familiaux',
        'Ne pas ignorer: Toute douleur thoracique qui dure > 5 minutes'
      ]
    },
    'Infection virale (grippe, Covid-19…)': {
      title: isEn ? 'Viral infection (flu, Covid-19...)' : 'Infection virale (grippe, Covid-19…)',
      tips: isEn ? [
        'Typical duration: 5-10 days for flu, variable for Covid',
        'Treatment: Rest, hydration, fever reducers',
        'When to consult: If breathing difficulties, high fever > 3 days',
        'Warning signs: Confusion, persistent chest pain'
      ] : [
        'Durée typique: 5-10 jours pour la grippe, variable pour Covid',
        'Traitement: Repos, hydratation, antipyrétiques',
        'Quand consulter: Si difficultés respiratoires, fièvre > 3 jours',
        'Signes d\'alerte: Confusion, douleur thoracique persistante'
      ]
    },
    'Infection bactérienne (angine, sinusite)': {
      title: isEn ? 'Bacterial infection (strep throat, sinusitis)' : 'Infection bactérienne (angine, sinusite)',
      tips: isEn ? [
        'Typical duration: 7-14 days without treatment',
        'Treatment: Antibiotics may be needed (prescription required)',
        'When to consult: If severe sore throat, difficulty swallowing',
        'Warning signs: Drooling, inability to swallow, breathing difficulty'
      ] : [
        'Durée typique: 7-14 jours sans traitement',
        'Traitement: Antibiotiques parfois nécessaires (ordonnance requise)',
        'Quand consulter: Si mal de gorge severe, difficulté à avaler',
        'Signes d\'alerte: Bave, incapacité à avaler, difficulté à respirer'
      ]
    },
    'Syndrome viral non spécifique': {
      title: isEn ? 'Non-specific viral syndrome' : 'Syndrome viral non spécifique',
      tips: isEn ? [
        'Typical duration: 3-7 days',
        'Symptoms: General fatigue, mild fever, body aches',
        'Treatment: Rest, hydration, symptom relief',
        'When to consult: If symptoms worsen or don\'t improve after 1 week'
      ] : [
        'Durée typique: 3-7 jours',
        'Symptômes: Fatigue générale, fièvre légère, courbatures',
        'Traitement: Repos, hydratation, soulagement des symptômes',
        'Quand consulter: Si symptômes s\'aggravent ou ne s\'améliorent pas après 1 semaine'
      ]
    },
    'Pathologie aiguë sévère': {
      title: isEn ? 'Severe acute condition' : 'Pathologie aiguë sévère',
      tips: isEn ? [
        'Emergency: Immediate medical attention required',
        'Do not wait: Symptoms may worsen rapidly',
        'Call 15 or go to nearest emergency department',
        'Bring your summary to present to medical staff'
      ] : [
        'Urgence: Attention médicale immédiate requise',
        'Ne pas attendre: Les symptômes peuvent s\'aggraver rapidement',
        'Appelez le 15 ou rendez-vous aux urgences les plus proches',
        'Apportez votre résumé à présenter au personnel médical'
      ]
    },
    'Syndrome coronarien aigu': {
      title: isEn ? 'Acute coronary syndrome' : 'Syndrome coronarien aigu',
      tips: isEn ? [
        'Emergency: Call 15 immediately',
        'Warning signs: Chest pain, sweating, nausea, arm pain',
        'Risk factors: Smoking, diabetes, high cholesterol, family history',
        'Do not drive yourself to the hospital'
      ] : [
        'Urgence: Appelez le 15 immédiatement',
        'Signes d\'alerte: Douleur thoracique, sueurs, nausées, douleur dans le bras',
        'Facteurs de risque: Tabac, diabète, cholestérol élevé, antécédents familiaux',
        'Ne conduisez pas vous-même à l\'hôpital'
      ]
    }
  }
})
</script>

<template>
  <div class="flex flex-col gap-5 fade-up">

    <!-- MAIN RESULT -->
    <div class="print-section bg-white rounded-2xl shadow-card p-10">

      <div class="flex items-center gap-4 mb-6">
        <div :class="[config.dotColor, 'w-16 h-16 rounded-full flex items-center justify-center']">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="result.level === 'urgence'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            <path v-else-if="result.level === 'rapide'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <p :class="[config.textColor, 'text-xs font-bold uppercase tracking-widest mb-1']">
            {{ config.label }}
          </p>
          <h2 class="font-serif text-2xl text-slate-800 leading-snug">{{ config.title }}</h2>
        </div>
      </div>

      <div class="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed mb-5">
        {{ config.explanation }}
      </div>

      <div v-if="result.flags.length" class="flex flex-wrap gap-2 mb-5">
        <span
          v-for="flag in result.flags"
          :key="flag"
          :class="config.badgeColor"
          class="rounded-full px-3 py-1 text-xs font-medium"
        >
          {{ flag }}
        </span>
      </div>

      <div class="flex flex-col gap-2 mb-6">
        <div v-for="(step, i) in config.steps" :key="i" class="flex items-start gap-3">
          <div :class="[config.dotColor, 'w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5']">
            {{ i + 1 }}
          </div>
          <p class="text-sm text-slate-600 leading-relaxed">{{ step }}</p>
        </div>
      </div>

      <!-- MEDICAL LEADS -->
      <div class="border-t border-slate-100 pt-5">
        <p class="text-sm font-semibold text-slate-700 mb-1">{{ t('pistes_exploration') }}</p>
        <p class="text-xs text-slate-400 mb-4 leading-relaxed">
          {{ locale === 'en'
            ? 'Based on your symptoms, here are possible causes to discuss during your consultation.'
            : 'Sur la base de vos symptômes, voici les causes qui pourraient être évoquées lors de votre consultation.'
          }}
        </p>

<div class="flex flex-col gap-2">
          <div
            v-for="piste in result.pistes"
            :key="piste.name"
            class="rounded-xl p-3"
            :class="piste.urgent
              ? 'bg-red-50 border border-red-200'
              : piste.source === 'openmed'
                ? 'bg-slate-100 border border-slate-200'
                : 'bg-slate-50 border border-slate-200'"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <p
                  class="text-sm font-semibold"
                  :class="piste.urgent ? 'text-red-700' : 'text-slate-700'"
                >
                  {{piste.name}}
                </p>
                <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ piste.desc }}</p>
                <p
                  class="text-[10px] font-medium uppercase tracking-wider mt-1"
                  :class="piste.source === 'openmed' ? 'text-slate-400' : 'text-slate-400'"
                >
                  {{piste.source === 'openmed' ? (locale === 'en' ? 'AI Analysis' : 'Analyse IA') : (locale === 'en' ? 'Medical rules' : 'Règles médicales') }}
                  <span v-if="piste.confidence"> · {{ (piste.confidence * 100).toFixed(0) }}% {{ locale === 'en' ? 'confidence' : 'confiance' }}</span>
                </p>
              </div>
              <button
                class="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                @click="togglePiste(piste.name)"
              >
                <svg class="w-4 h-4 transition-transform" :class="expandedPistes.has(piste.name) ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>
            
            <div v-if="expandedPistes.has(piste.name)" class="mt-3 pt-3 border-t border-slate-200">
              <template v-if="getPisteTips(piste).length">
                <p class="text-xs font-semibold text-brand-600 mb-2 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ locale === 'en' ? 'Learn more' : 'En savoir plus' }}
                </p>
                <ul class="space-y-1.5">
                  <li
                    v-for="(tip, idx) in getPisteTips(piste)"
                    :key="idx"
                    class="text-xs text-slate-600 flex items-start gap-2"
                  >
                    <span class="text-brand-400 mt-0.5">•</span>
                    <span>{{ tip }}</span>
                  </li>
                </ul>
                <a
                  v-if="getPisteDocUrl(piste)"
                  :href="getPisteDocUrl(piste)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-3 inline-flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 underline"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  {{ locale === 'en' ? 'Search on Google' : 'Rechercher sur Google' }}
                </a>
              </template>
              <template v-else>
                <p class="text-xs text-slate-500 italic">
                  {{ locale === 'en' ? 'No additional details available for this piste.' : 'Aucun détail supplémentaire disponible pour cette piste.' }}
                </p>
              </template>
            </div>
          </div>
        </div>

        <div class="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
          {{ locale === 'en'
            ? 'These leads are indicative and do not constitute a medical diagnosis. Only a doctor can make a diagnosis after clinical examination.'
            : 'Ces pistes sont indicatives et ne constituent pas un diagnostic médical. Seul un médecin peut poser un diagnostic après examen clinique.'
          }}
        </div>
      </div>

      <p class="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-5 leading-relaxed">
        {{ locale === 'en'
          ? 'This result is indicative and based on your statements. It does not replace the evaluation of a healthcare professional. In case of doubt, call 15.'
          : 'Ce résultat est indicatif et basé sur vos déclarations. Il ne remplace pas l\'évaluation d\'un professionnel de santé. En cas de doute, appelez le 15.'
        }}
      </p>
    </div>

    <!-- SUMMARY -->
    <div class="bg-slate-50 rounded-2xl p-6">
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        {{ locale === 'en' ? 'Summary — to present to your doctor' : 'Résumé — à présenter à votre médecin' }}
      </p>
      <div class="flex flex-col divide-y divide-slate-200">
        <div
          v-for="key in summaryKeys"
          :key="key"
          class="flex justify-between py-2.5 text-sm"
        >
          <template v-if="answers[key] !== undefined">
            <span class="text-slate-400">{{ summaryLabels[key] || key }}</span>
            <span class="font-medium text-slate-700 text-right max-w-[55%]">
              {{ key === 'free_text' ? `"${String(answers[key]).substring(0, 50)}…"` : valueLabels[String(answers[key])] || String(answers[key]) }}
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="print-section flex gap-3">
      <button
        class="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 rounded-xl py-3 font-medium text-sm hover:bg-slate-200 transition-all"
        @click="copyToClipboard"
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        <svg v-else class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ copied ? (locale === 'en' ? 'Copied!' : 'Copié !') : (locale === 'en' ? 'Copy' : 'Copier') }}
      </button>
      <button
        class="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 rounded-xl py-3 font-medium text-sm hover:bg-slate-200 transition-all"
        @click="shareResult"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        {{ locale === 'en' ? 'Share' : 'Partager' }}
      </button>
      <button
        class="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 rounded-xl py-3 font-medium text-sm hover:bg-slate-200 transition-all"
        @click="printResult"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
        {{ locale === 'en' ? 'Print' : 'Imprimer' }}
      </button>
    </div>

    <!-- SOURCE CODE LINK -->
    <div class="text-center pt-4 border-t border-slate-100">
      <a
        href="https://github.com/anomalyco/mediguide"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        {{ locale === 'en' ? 'View source code' : 'Voir le code source' }}
      </a>
      <span class="text-xs text-slate-300 mx-2">·</span>
      <span class="text-xs text-slate-400">
        {{ locale === 'en' ? 'Medical information from' : 'Informations médicales de' }}
      </span>
      <a
        href="https://www.ameli.fr"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-brand-500 hover:text-brand-600"
      >
        ameli.fr
      </a>
    </div>

    <!-- RESTART -->
    <button
      class="w-full bg-brand-500 text-white rounded-2xl py-3.5 font-semibold text-sm hover:bg-brand-600 transition-all hover:-translate-y-0.5"
      @click="emit('restart')"
    >
      {{ t('restart') }}
    </button>

  </div>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .no-print, .no-print * {
    display: none !important;
  }
  .print-section, .print-section * {
    visibility: visible;
  }
  .print-section {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 20px;
    background: white;
  }
}
</style>