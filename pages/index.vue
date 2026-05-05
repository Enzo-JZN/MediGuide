<script setup lang="ts">
import type { Answers, TriageResult, NLPEntity } from '~/types'
import { useQuestionnaire } from '~/composables/useQuestionnaire'
import { useTriage } from '~/composables/useTriage'
import { useLocale } from '~/composables/useLocale'

type Screen = 'lang' | 'welcome' | 'quiz' | 'recap' | 'freetext' | 'loading' | 'result'
const screen = ref<Screen>('lang')
const current = ref(0)
const answers = ref<Answers>({})
const result = ref<TriageResult | null>(null)
const quizSummary = ref('')
const additionalText = ref('')
const loadingText = ref('')

const { locale, t } = useLocale()
const { questions } = useQuestionnaire()
const { computeLocal, fetchTriage } = useTriage()

const start = () => {
  screen.value = 'quiz'
  current.value = 0
}

const onAnswer = (key: string, value: string | number) => {
  answers.value[key] = value
}

const onNext = async () => {
  if (current.value < questions.value.length - 1) {
    current.value++
  } else {
    screen.value = 'recap'
  }
}

const onBack = () => {
  if (current.value > 0) {
    current.value--
  } else {
    screen.value = 'welcome'
  }
}

const onRecapAnalyze = (summary: string, additional: string) => {
  quizSummary.value = summary
  additionalText.value = additional
  screen.value = 'freetext'
}

const onRecapSkip = () => {
  submitTriage('', false)
}

const onFreeTextDone = (text: string, entities: NLPEntity[]) => {
  submitTriage(text, true)
}

const onFreeTextSkip = () => {
  submitTriage('', false)
}

const submitting = ref(false)
const processingRefinement = ref(false)

const submitTriage = async (freeText: string, hasAI: boolean) => {
  if (submitting.value) return
  submitting.value = true
  screen.value = 'loading'

  const finalText = hasAI && additionalText.value
    ? `${quizSummary.value} ${additionalText.value}`
    : freeText || ''

  loadingText.value = hasAI
    ? (locale.value === 'en'
      ? 'Sending to backend · AI analysis · Calculating triage...'
      : 'Envoi au backend · Analyse IA · Calcul du triage…')
    : (locale.value === 'en' ? 'Calculating by rules...' : 'Calcul par règles…')

  // Partie déterministe sans IA - pas d'appel API
  if (!hasAI) {
    result.value = computeLocal(answers.value)
    submitting.value = false
    screen.value = 'result'
    return
  }

  // Partie avec IA - appel API
  try {
    result.value = await fetchTriage(finalText, answers.value)
  } catch {
    loadingText.value = locale.value === 'en'
      ? 'Offline mode · Calculating by rules...'
      : 'Mode hors-ligne · Calcul par règles…'
    await new Promise(r => setTimeout(r, 600))
    result.value = computeLocal(answers.value)
  } finally {
    submitting.value = false
  }

  screen.value = 'result'
}

const restart = () => {
  answers.value = {}
  current.value = 0
  result.value = null
  quizSummary.value = ''
  additionalText.value = ''
  submitting.value = false
  screen.value = 'lang'
}
</script>

<template>
  <div>

    <!-- LANGUAGE SELECT -->
    <div v-if="screen === 'lang'" class="fade-up">
      <div class="bg-white rounded-2xl shadow-card p-10">
        <div class="flex items-center justify-center mb-6">
          <div class="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.023 18.023 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.013 7.387 10 12 10 12s3-4.613 2.751-7"/>
            </svg>
          </div>
        </div>
        <h2 class="font-serif text-2xl text-slate-800 text-center mb-2">{{ t('select_language') }}</h2>
        <div class="flex gap-4">
          <button
            class="flex-1 py-4 border-2 rounded-xl text-base font-medium transition-all hover:border-brand-500 hover:bg-brand-50"
            :class="locale === 'fr' ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-slate-200 text-slate-600'"
            @click="locale = 'fr'"
          >
            🇫🇷 Français
          </button>
          <button
            class="flex-1 py-4 border-2 rounded-xl text-base font-medium transition-all hover:border-brand-500 hover:bg-brand-50"
            :class="locale === 'en' ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-slate-200 text-slate-600'"
            @click="locale = 'en'"
          >
            🇬🇧 English
          </button>
        </div>
        <button
          class="w-full mt-6 bg-brand-500 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-brand-600 transition-all hover:-translate-y-0.5"
          @click="screen = 'welcome'"
        >
          {{ t('continue') }}
        </button>
      </div>
    </div>

    <!-- WELCOME -->
    <div v-else-if="screen === 'welcome'" class="fade-up">
      <div class="bg-white rounded-2xl shadow-card p-10">

        <h1 class="font-serif text-4xl text-slate-800 mb-3 leading-snug">
          {{ t('welcome_title') }} <em class="text-brand-500 not-italic">MediGuide</em>
        </h1>
        <p class="text-slate-500 text-base leading-relaxed mb-8">
          {{ t('welcome_subtitle') }}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-slate-50 rounded-xl p-5 flex gap-4 items-start">
            <svg class="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-slate-700">{{ t('feature_questions') }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ t('feature_questions_desc') }}</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-xl p-5 flex gap-4 items-start">
            <svg class="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-slate-700">{{ t('feature_ai') }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ t('feature_ai_desc') }}</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-xl p-5 flex gap-4 items-start">
            <svg class="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-slate-700">{{ t('feature_rgpd') }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ t('feature_rgpd_desc') }}</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-xl p-5 flex gap-4 items-start">
            <svg class="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-slate-700">{{ t('feature_result') }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ t('feature_result_desc') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 border border-orange-200 rounded-xl p-3.5 text-xs text-orange-600 leading-relaxed mb-6">
          <strong>{{ t('important') }} :</strong> {{ t('important_text') }}
        </div>

        <button
          class="w-full bg-brand-500 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-brand-600 transition-all hover:-translate-y-0.5"
          @click="start"
        >
          {{ t('start_button') }}
        </button>
      </div>
    </div>

    <!-- QUIZ -->
    <QuestionCard
      v-else-if="screen === 'quiz'"
      :question="questions[current]"
      :current="current"
      :total="questions.length"
      :answers="answers"
      @answer="onAnswer"
      @next="onNext"
      @back="onBack"
    />

    <!-- RECAP -->
    <QuizRecap
      v-else-if="screen === 'recap'"
      :answers="answers"
      @analyze="onRecapAnalyze"
      @skip="onRecapSkip"
    />

    <!-- FREE TEXT NLP -->
    <FreeTextAnalyzer
      v-else-if="screen === 'freetext'"
      :initial-summary="quizSummary"
      :additional-text="additionalText"
      @done="onFreeTextDone"
      @skip="onFreeTextSkip"
    />

    <!-- LOADING -->
    <div v-else-if="screen === 'loading'" class="bg-white rounded-2xl shadow-card p-10">
      <div class="flex flex-col items-center justify-center py-12 gap-5">
        <div class="w-14 h-14 border-4 border-brand-100 border-t-brand-500 rounded-full spin" />
        <p class="font-serif text-2xl text-slate-700">{{ t('analyzing') }}</p>
        <p class="text-sm text-slate-400 text-center">{{ loadingText }}</p>
      </div>
    </div>

    <!-- RESULT -->
    <TriageResult
      v-else-if="screen === 'result' && result"
      :result="result"
      :answers="answers"
      @restart="restart"
    />

  </div>
</template>