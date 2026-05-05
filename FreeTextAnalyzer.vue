<script setup lang="ts">
import type { NLPEntity } from '~/types'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  initialSummary?: string
  additionalText?: string
}>()

const emit = defineEmits<{
  done: [text: string, entities: NLPEntity[]]
  skip: []
}>()

const { locale, t } = useLocale()
const text = ref(props.additionalText || '')
const loading = ref(false)
const entities = ref<NLPEntity[]>([])
const analyzed = ref(false)
const error = ref('')
const consent = ref(false)

const labelColors: Record<string, string> = {
  SYMPTOM:    'bg-red-50 text-red-600 ring-1 ring-red-200',
  SIGN:       'bg-red-50 text-red-600 ring-1 ring-red-200',
  DISEASE:    'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  PROBLEM:    'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  MEDICATION: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
  DRUG:       'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
  ANATOMY:    'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
  VALUE:      'bg-purple-50 text-purple-600 ring-1 ring-purple-200',
}

const getTagClass = (label: string) =>
  labelColors[label.toUpperCase()] || 'bg-slate-100 text-slate-600'

const labelNames = computed(() => {
  if (locale.value === 'en') {
    return {
      SYMPTOM: 'Symptom', SIGN: 'Sign', DISEASE: 'Disease',
      PROBLEM: 'Problem', MEDICATION: 'Medication', DRUG: 'Drug',
      ANATOMY: 'Anatomy', VALUE: 'Value',
    }
  }
  return {
    SYMPTOM: 'Symptôme', SIGN: 'Signe', DISEASE: 'Pathologie',
    PROBLEM: 'Problème', MEDICATION: 'Médicament', DRUG: 'Médicament',
    ANATOMY: 'Anatomie', VALUE: 'Valeur',
  }
})

const analyze = async () => {
  if (!consent.value) return

  const combinedText = props.initialSummary
    ? `${props.initialSummary} ${text.value}`.trim()
    : text.value

  if (!combinedText.trim()) { emit('skip'); return }

  loading.value = true
  error.value = ''

  try {
    const result = await $fetch<any>('/api/analyze', {
      method: 'POST',
      body: { text: combinedText }
    })
    entities.value = result.entities || []
    analyzed.value = true
  } catch {
    error.value = locale.value === 'en'
      ? 'AI service temporarily unavailable. You can continue without analysis.'
      : 'Service IA momentanément indisponible. Vous pouvez continuer sans l\'analyse.'
    setTimeout(() => emit('skip'), 2000)
  } finally {
    loading.value = false
  }
}

const confirmAndContinue = () => {
  const combinedText = props.initialSummary
    ? `${props.initialSummary} ${text.value}`.trim()
    : text.value
  emit('done', combinedText, entities.value)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-card p-10 fade-up">

    <div class="flex items-center gap-3 mb-1">
      <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
      <p class="text-xs font-bold text-brand-500 uppercase tracking-widest">{{ t('ai_analysis_title') }}</p>
    </div>
    <h2 class="font-serif text-2xl text-slate-800 leading-snug mb-1">
      {{ t('ai_analysis_title') }}
    </h2>
    <p class="text-sm text-slate-500 mb-6">
      {{ t('ai_analysis_subtitle') }}
    </p>

    <div v-if="initialSummary" class="bg-slate-50 rounded-xl p-4 mb-4">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {{ locale === 'en' ? 'Questionnaire summary' : 'Résumé du questionnaire' }}
      </p>
      <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{{ initialSummary }}</p>
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
        v-model="text"
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

    <div v-if="analyzed && entities.length > 0" class="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{{ t('entities_detected') }}</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="e in entities"
          :key="e.start + e.text"
          :class="getTagClass(e.label)"
          :title="`${labelNames[e.label] || e.label} — ${locale === 'en' ? 'confidence' : 'confiance'}: ${(e.confidence * 100).toFixed(0)}%`"
          class="text-xs font-medium px-2.5 py-1 rounded-full"
        >
          {{ e.text }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="mt-4 flex items-center gap-2 text-brand-500 text-sm">
      <div class="w-4 h-4 border-2 border-brand-200 border-t-brand-500 rounded-full spin" />
      {{ t('analyzing') }}
    </div>

    <div v-if="error" class="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-600">
      {{ error }}
    </div>

    <div class="flex flex-col gap-3 mt-8">
      <button
        v-if="!analyzed"
        :disabled="loading || !consent"
        class="w-full flex items-center justify-center gap-2 bg-brand-500 text-white rounded-xl py-3.5 font-semibold text-sm transition-all hover:bg-brand-600 hover:-translate-y-0.5 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none"
        @click="analyze"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        {{ t('analyze') }}
      </button>

      <button
        v-if="analyzed"
        class="w-full flex items-center justify-center gap-2 bg-brand-500 text-white rounded-xl py-3.5 font-semibold text-sm transition-all hover:bg-brand-600 hover:-translate-y-0.5"
        @click="confirmAndContinue"
      >
        {{ t('continue_to_result') }}
      </button>

      <button
        class="w-full text-slate-500 text-sm py-2 hover:text-slate-700 transition-colors"
        @click="emit('skip')"
      >
        {{ t('skip_step') }}
      </button>
    </div>

  </div>
</template>