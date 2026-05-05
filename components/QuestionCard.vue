<script setup lang="ts">
import type { Question, Answers } from '~/types'
import { useQuestionnaire } from '~/composables/useQuestionnaire'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  question: Question
  current: number
  total: number
  answers: Answers
}>()

const emit = defineEmits<{
  answer: [key: string, value: string | number]
  next: []
  back: []
}>()

const { locale, t } = useLocale()
const { bodyZones } = useQuestionnaire()

const progress = computed(() => ((props.current + 1) / props.total) * 100)

const isAnswered = computed(() => {
  if (props.question.type === 'age_gender') {
    return !!props.answers['identity_age'] && !!props.answers['identity_gender']
  }
  return props.answers[props.question.id] !== undefined
})

const ageValue = ref(String(props.answers['identity_age'] || ''))
const onAgeInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  ageValue.value = val
  emit('answer', 'identity_age', val)
}

const genderOptions = computed(() => {
  if (locale.value === 'en') {
    return [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other_gender' }
    ]
  }
  return [
    { label: 'Homme', value: 'male' },
    { label: 'Femme', value: 'female' },
    { label: 'Autre', value: 'other_gender' }
  ]
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-card p-10 fade-up">

    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">{{ t('question') }}</span>
      <span class="text-xs text-slate-400">{{ current + 1 }} / {{ total }}</span>
    </div>
    <div class="w-full bg-slate-100 rounded-full h-1.5 mb-10">
      <div class="bg-brand-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${progress}%` }" />
    </div>

    <p class="text-sm font-bold text-brand-500 uppercase tracking-widest mb-2">{{ question.category }}</p>
    <h2 class="font-serif text-3xl text-slate-800 leading-snug mb-8">{{ question.text }}</h2>

    <!-- OPTIONS -->
    <div v-if="question.type === 'options'" class="flex flex-col gap-3">
      <button
        v-for="opt in question.options"
        :key="opt.value"
        class="flex items-center gap-4 bg-slate-50 border-2 rounded-xl px-5 py-4 text-left text-base font-medium transition-all duration-150 hover:border-brand-500 hover:bg-brand-50 hover:translate-x-1"
        :class="answers[question.id] === opt.value
          ? 'border-brand-500 bg-brand-50 font-semibold'
          : 'border-transparent'"
        @click="emit('answer', question.id, opt.value)"
      >
        <span class="text-slate-400">{{ opt.icon }}</span>
        <span>{{ opt.label }}</span>
      </button>
    </div>

    <!-- SCALE -->
    <div v-else-if="question.type === 'scale'">
      <div class="flex justify-between text-sm text-slate-400 mb-3">
        <span>{{ t('low') }} (1)</span>
        <span>{{ t('high') }} (10)</span>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="i in 10"
          :key="i"
          class="flex-1 min-w-[44px] py-3.5 border-2 rounded-xl font-bold text-base transition-all duration-150 hover:border-brand-500 hover:text-brand-500"
          :class="answers[question.id] == i
            ? 'bg-brand-500 border-brand-500 text-white'
            : 'bg-slate-50 border-slate-100 text-slate-500'"
          @click="emit('answer', question.id, i)"
        >
          {{ i }}
        </button>
      </div>
    </div>

    <!-- AGE + GENDER -->
    <div v-else-if="question.type === 'age_gender'" class="flex flex-wrap gap-4">
      <div class="flex-1 min-w-[160px]">
        <input
          type="number"
          :value="ageValue"
          :placeholder="t('age_placeholder')"
          min="1" max="120"
          class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-base outline-none focus:border-brand-500 focus:bg-brand-50 transition-all"
          @input="onAgeInput"
        />
        <p class="text-xs text-slate-400 mt-2">{{ t('age_unit') }}</p>
      </div>
      <div class="flex gap-3 flex-wrap">
        <button
          v-for="g in genderOptions"
          :key="g.value"
          class="px-5 py-4 border-2 rounded-xl text-base transition-all duration-150 hover:border-brand-500 hover:text-brand-500 whitespace-nowrap"
          :class="answers['identity_gender'] === g.value
            ? 'border-brand-500 bg-brand-50 text-brand-500 font-semibold'
            : 'border-slate-100 bg-slate-50 text-slate-500'"
          @click="emit('answer', 'identity_gender', g.value)"
        >
          {{ g.label }}
        </button>
      </div>
    </div>

    <!-- BODY ZONES -->
    <div v-else-if="question.type === 'body_zones'" class="grid grid-cols-2 gap-3">
      <button
        v-for="zone in bodyZones"
        :key="zone.value"
        class="flex items-center gap-3 bg-slate-50 border-2 rounded-xl px-4 py-4 text-left text-base transition-all duration-150 hover:border-brand-500 hover:bg-brand-50"
        :class="answers[question.id] === zone.value
          ? 'border-brand-500 bg-brand-50 font-semibold'
          : 'border-transparent'"
        @click="emit('answer', question.id, zone.value)"
      >
        <span class="text-slate-400">{{ zone.icon }}</span>
        <span>{{ zone.label }}</span>
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between items-center mt-10">
      <button
        v-if="current > 0"
        class="flex items-center gap-2 text-slate-400 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm hover:border-brand-500 hover:text-brand-500 transition-all"
        @click="emit('back')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        {{ t('back') }}
      </button>
      <div v-else />

      <button
        :disabled="!isAnswered"
        class="flex items-center gap-2 bg-brand-500 text-white rounded-xl px-8 py-3.5 text-base font-semibold transition-all duration-150 hover:bg-brand-600 hover:-translate-y-0.5 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none"
        @click="emit('next')"
      >
        {{ t('next') }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

  </div>
</template>