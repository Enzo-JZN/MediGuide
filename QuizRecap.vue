<script setup lang="ts">
import type { Answers } from '~/types'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  answers: Answers
}>()

const emit = defineEmits<{
  analyze: [summary: string, additionalText: string]
  skip: []
}>()

const { locale, t } = useLocale()
const additionalText = ref('')
const consent = ref(false)

const valueLabels: Record<string, string> = {
  fever: 'Fièvre / Frissons', chest: 'Douleur thoracique', abdomen: 'Douleur abdominale',
  head: 'Maux de tête', nausea: 'Nausées', pain: 'Douleur localisée',
  wound: 'Plaie / Blessure', other: 'Autre',
  hours: 'quelques heures', days_3: '1 à 3 jours', days_7: '4 à 7 jours', weeks: 'plus d\'une semaine',
  worse: 'aggravation', stable: 'stable', better: 'amélioration',
  no_fever: 'pas de fièvre', low_fever: 'légère (37.5-38.4°C)', high_fever: 'modérée (38.5-39.9°C)', very_high_fever: 'très élevée (≥40°C)',
  none: 'aucun', cardiac_diabetes: 'cardiaque ou diabète', respiratory: 'respiratoire', other_chronic: 'autre',
  consciousness: 'perte de conscience', bleeding: 'saignement important', breathing: 'difficultés respiratoires', none_alarm: 'aucun',
  first_time: 'non', follow_up: 'oui, suivi en cours', no_improvement: 'oui, sans amélioration',
  no_allergy: 'aucune allergie', drug_allergy: 'allergie médicamenteuse', food_allergy: 'allergie alimentaire', other_allergy: 'autre allergie',
  nothing: 'rien pris', analgesic: 'antalgique / antipyrétique', antibiotic: 'antibiotique', other_meds: 'autre médicament',
  male: 'Homme', female: 'Femme', other_gender: 'Autre',
  head_neck: 'tête / cou', chest_thorax: 'thorax', heart: 'coeur', arm_shoulder: 'bras / épaule',
  leg_knee: 'jambe / genou', foot_ankle: 'pied / cheville', back: 'dos / colonne', diffuse: 'diffus',
}

const valueLabelsEn: Record<string, string> = {
  fever: 'Fever / Chills', chest: 'Chest pain', abdomen: 'Abdominal pain',
  head: 'Headache', nausea: 'Nausea', pain: 'Localized pain',
  wound: 'Wound / Injury', other: 'Other',
  hours: 'few hours', days_3: '1 to 3 days', days_7: '4 to 7 days', weeks: 'more than a week',
  worse: 'worsening', stable: 'stable', better: 'improving',
  no_fever: 'no fever', low_fever: 'mild (37.5-38.4°C)', high_fever: 'moderate (38.5-39.9°C)', very_high_fever: 'very high (≥40°C)',
  none: 'none', cardiac_diabetes: 'heart or diabetes', respiratory: 'respiratory', other_chronic: 'other',
  consciousness: 'loss of consciousness', bleeding: 'significant bleeding', breathing: 'breathing difficulties', none_alarm: 'none',
  first_time: 'no', follow_up: 'yes, ongoing follow-up', no_improvement: 'yes, without improvement',
  no_allergy: 'no allergy', drug_allergy: 'drug allergy', food_allergy: 'food allergy', other_allergy: 'other allergy',
  nothing: 'nothing taken', analgesic: 'analgesic / antipyretic', antibiotic: 'antibiotic', other_meds: 'other medication',
  male: 'Male', female: 'Female', other_gender: 'Other',
  head_neck: 'head / neck', chest_thorax: 'thorax', heart: 'heart', arm_shoulder: 'arm / shoulder',
  leg_knee: 'leg / knee', foot_ankle: 'foot / ankle', back: 'back / spine', diffuse: 'diffuse',
}

const labels = computed(() => locale.value === 'en' ? valueLabelsEn : valueLabels)

const genderLabel = computed(() => {
  const g = props.answers['identity_gender']
  return g ? labels.value[String(g)] || String(g) : null
})

const summaryText = computed(() => {
  const parts: string[] = []
  const age = props.answers['identity_age']
  const gender = genderLabel.value
  const complaint = props.answers['chief_complaint']
  const location = props.answers['pain_location']
  const duration = props.answers['duration']
  const severity = props.answers['severity']
  const worsening = props.answers['worsening']
  const fever = props.answers['fever_temp']
  const alarm = props.answers['alarm_signs']
  const chronic = props.answers['chronic']
  const allergies = props.answers['allergies']
  const medication = props.answers['self_medication']
  const consulted = props.answers['consulted']

  if (age) {
    let intro = locale.value === 'en'
      ? `Patient, ${age} years old`
      : `Patient de ${age} ans`
    if (gender) intro += `, ${gender.toLowerCase()}`
    parts.push(intro)
  }

  if (complaint) {
    const label = labels.value[String(complaint)] || String(complaint)
    parts.push(locale.value === 'en'
      ? `presents with ${label.toLowerCase()}`
      : `se plaint de ${label.toLowerCase()}`
    )
  }

  if (location) {
    parts.push(locale.value === 'en'
      ? `pain located at ${labels.value[String(location)] || String(location)}`
      : `douleur située au niveau ${labels.value[String(location)] || String(location)}`
    )
  }

  if (duration) {
    parts.push(locale.value === 'en'
      ? `duration: ${labels.value[String(duration)] || String(duration)}`
      : `durée depuis ${labels.value[String(duration)] || String(duration)}`
    )
  }

  if (severity) {
    parts.push(locale.value === 'en'
      ? `intensity estimated at ${severity}/10`
      : `intensité estimée à ${severity}/10`
    )
  }

  if (worsening) {
    const wLabel = labels.value[String(worsening)] || String(worsening)
    parts.push(locale.value === 'en'
      ? `evolution: ${wLabel.toLowerCase()}`
      : `évolution en ${wLabel.toLowerCase()}`
    )
  }

  if (fever && fever !== 'no_fever') {
    parts.push(locale.value === 'en'
      ? `fever ${labels.value[String(fever)] || String(fever).replace('fever_', '')}`
      : `présence de fièvre ${labels.value[String(fever)] || String(fever).replace('fever_', '')}`
    )
  }

  if (alarm && alarm !== 'none_alarm') {
    parts.push(locale.value === 'en'
      ? `with warning sign: ${labels.value[String(alarm)] || String(alarm)}`
      : `avec signe d'alarme: ${labels.value[String(alarm)] || String(alarm)}`
    )
  }

  if (chronic && chronic !== 'none') {
    parts.push(locale.value === 'en'
      ? `history: ${labels.value[String(chronic)] || String(chronic)}`
      : `antécédents: ${labels.value[String(chronic)] || String(chronic)}`
    )
  }

  if (allergies && allergies !== 'no_allergy') {
    parts.push(locale.value === 'en'
      ? `allergies: ${labels.value[String(allergies)] || String(allergies)}`
      : `allergies: ${labels.value[String(allergies)] || String(allergies)}`
    )
  }

  if (medication && medication !== 'nothing') {
    parts.push(locale.value === 'en'
      ? `took ${labels.value[String(medication)] || String(medication)}`
      : `a pris ${labels.value[String(medication)] || String(medication)}`
    )
  }

  if (consulted) {
    const cLabel = labels.value[String(consulted)] || String(consulted)
    if (consulted === 'first_time') {
      parts.push(locale.value === 'en'
        ? `first consultation for this problem`
        : `première consultation pour ce problème`
      )
    } else {
      parts.push(locale.value === 'en'
        ? `previous consultation: ${cLabel.toLowerCase()}`
        : `consultation préalable: ${cLabel.toLowerCase()}`
      )
    }
  }

  if (!parts.length) return ''
  return parts.join('. ').replace(/^./, l => l.toUpperCase()) + '.'
})

const canSubmit = computed(() => !!summaryText.value)

const submitWithAI = () => {
  emit('analyze', summaryText.value, additionalText.value)
}

const submitDirect = () => {
  emit('skip')
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-card p-10 fade-up">

    <div class="flex items-center gap-3 mb-1">
      <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <p class="text-xs font-bold text-brand-500 uppercase tracking-widest">{{ t('recap_title') }}</p>
    </div>
    <h2 class="font-serif text-2xl text-slate-800 leading-snug mb-1">
      {{ t('recap_title') }}
    </h2>
    <p class="text-sm text-slate-500 mb-6">
      {{ t('recap_subtitle') }}
    </p>

    <div v-if="summaryText" class="bg-slate-50 rounded-xl p-4 mb-4">
      <p class="text-sm text-slate-700 leading-relaxed">{{ summaryText }}</p>
    </div>

    <div class="mb-1">
      <p class="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        {{ t('additional_info') }}
        <span class="text-slate-400 font-normal">(optionnel)</span>
      </p>
      <textarea
        v-model="additionalText"
        :placeholder="t('additional_info_placeholder')"
        rows="3"
        class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm resize-none outline-none focus:border-brand-500 focus:bg-brand-50 transition-all leading-relaxed"
      />
    </div>

    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
          <p class="text-sm font-semibold text-amber-700 mb-1">{{ t('ai_warning_title') }}</p>
          <p class="text-xs text-amber-600 leading-relaxed mb-3">{{ t('ai_warning_text') }}</p>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="consent"
              type="checkbox"
              class="w-4 h-4 text-brand-500 border-amber-300 rounded focus:ring-brand-500"
            />
            <span class="text-xs text-amber-700">{{ t('ai_consent') }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-8">
      <button
        :disabled="!canSubmit || !consent"
        class="w-full flex items-center justify-center gap-2 bg-brand-500 text-white rounded-xl py-3.5 font-semibold text-sm transition-all hover:bg-brand-600 hover:-translate-y-0.5 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none"
        @click="submitWithAI"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        {{ t('analyze_with_ai') }}
      </button>
      <button
        class="w-full text-slate-500 text-sm py-2 hover:text-slate-700 transition-colors"
        @click="submitDirect"
      >
        {{ t('get_result_directly') }}
      </button>
    </div>

  </div>
</template>