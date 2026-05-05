export interface QuestionOption {
  icon: string
  label: string
  value: string
}

export interface Question {
  id: string
  category: string
  text: string
  type: 'options' | 'scale' | 'age_gender' | 'body_zones'
  options?: QuestionOption[]
  min?: number
  max?: number
}

export interface NLPEntity {
  text: string
  label: string
  confidence: number
  start: number
  end: number
}

export interface AnalyzeResponse {
  entities: NLPEntity[]
  symptoms_detected: string[]
  urgency_hint: 'low' | 'medium' | 'high'
  raw_text: string
}

export interface PisteDetails {
  typical_duration?: string
  treatment?: string
  when_to_consult?: string
  warning_signs?: string
  googleSearchQuery?: string
}

export interface Piste {
  name: string
  desc: string
  source: 'claude' | 'rules'
  urgent?: boolean
  confidence?: number
  details?: PisteDetails | null
}

export interface TriageResult {
  level: 'urgence' | 'rapide' | 'standard'
  score: number
  flags: string[]
  pistes: Piste[]
  summary: string
}

export type Answers = Record<string, string | number>