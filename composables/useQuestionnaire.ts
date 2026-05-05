import type { Question } from '~/types'
import { useLocale } from './useLocale'

export const useQuestionnaire = () => {
  const { locale } = useLocale()

  const questions = computed<Question[]>(() => {
    if (locale.value === 'en') {
      return [
        {
          id: 'identity',
          category: 'Patient Profile',
          text: 'What is your age and gender?',
          type: 'age_gender'
        },
        {
          id: 'chief_complaint',
          category: 'Main Complaint',
          text: 'What is your main problem today?',
          type: 'options',
          options: [
            { icon: '→', label: 'Fever / Chills / Severe fatigue', value: 'fever' },
            { icon: '→', label: 'Chest pain or shortness of breath', value: 'chest' },
            { icon: '→', label: 'Abdominal pain', value: 'abdomen' },
            { icon: '→', label: 'Severe headaches / Dizziness', value: 'head' },
            { icon: '→', label: 'Nausea / Vomiting / Diarrhea', value: 'nausea' },
            { icon: '→', label: 'Localized pain (back, limb, joint)', value: 'pain' },
            { icon: '→', label: 'Wound / Injury / Trauma', value: 'wound' },
            { icon: '→', label: 'Other general symptom', value: 'other' },
          ]
        },
        {
          id: 'pain_location',
          category: 'Location',
          text: 'Where is your discomfort or pain mainly located?',
          type: 'body_zones'
        },
        {
          id: 'duration',
          category: 'Duration',
          text: 'How long have you been experiencing these symptoms?',
          type: 'options',
          options: [
            { icon: '→', label: 'Less than a few hours', value: 'hours' },
            { icon: '→', label: '1 to 3 days', value: 'days_3' },
            { icon: '→', label: '4 to 7 days', value: 'days_7' },
            { icon: '→', label: 'More than a week', value: 'weeks' },
          ]
        },
        {
          id: 'severity',
          category: 'Intensity',
          text: 'On a scale of 1 to 10, rate your discomfort intensity.',
          type: 'scale',
          min: 1,
          max: 10
        },
        {
          id: 'worsening',
          category: 'Evolution',
          text: 'How have your symptoms evolved since they started?',
          type: 'options',
          options: [
            { icon: '→', label: 'They are getting worse', value: 'worse' },
            { icon: '→', label: 'They remain stable', value: 'stable' },
            { icon: '→', label: 'They are improving', value: 'better' },
          ]
        },
        {
          id: 'fever_temp',
          category: 'Temperature',
          text: 'Do you have a fever? If so, at what temperature?',
          type: 'options',
          options: [
            { icon: '→', label: 'No fever (< 37.5°C)', value: 'no_fever' },
            { icon: '→', label: 'Mild (37.5 – 38.4°C)', value: 'low_fever' },
            { icon: '→', label: 'Moderate to high (38.5 – 39.9°C)', value: 'high_fever' },
            { icon: '→', label: 'Very high (≥ 40°C)', value: 'very_high_fever' },
          ]
        },
        {
          id: 'alarm_signs',
          category: 'Warning Signs',
          text: 'Are you experiencing any of these signs?',
          type: 'options',
          options: [
            { icon: '→', label: 'Loss of consciousness or sudden confusion', value: 'consciousness' },
            { icon: '→', label: 'Significant or uncontrolled bleeding', value: 'bleeding' },
            { icon: '→', label: 'Difficulty breathing / chest tightness', value: 'breathing' },
            { icon: '→', label: 'None of these signs', value: 'none_alarm' },
          ]
        },
        {
          id: 'chronic',
          category: 'Medical History',
          text: 'Do you have chronic diseases or regular treatment?',
          type: 'options',
          options: [
            { icon: '→', label: 'No, no particular history', value: 'none' },
            { icon: '→', label: 'Yes — heart problem or diabetes', value: 'cardiac_diabetes' },
            { icon: '→', label: 'Yes — respiratory problem (asthma, COPD…)', value: 'respiratory' },
            { icon: '→', label: 'Yes — other ongoing treatment', value: 'other_chronic' },
          ]
        },
        {
          id: 'allergies',
          category: 'Known Allergies',
          text: 'Do you have any known allergies?',
          type: 'options',
          options: [
            { icon: '→', label: 'No, no known allergy', value: 'no_allergy' },
            { icon: '→', label: 'Yes — drug allergy', value: 'drug_allergy' },
            { icon: '→', label: 'Yes — food allergy', value: 'food_allergy' },
            { icon: '→', label: 'Yes — other allergy', value: 'other_allergy' },
          ]
        },
        {
          id: 'self_medication',
          category: 'Self-medication',
          text: 'Have you taken any medication for this problem?',
          type: 'options',
          options: [
            { icon: '→', label: "No, nothing yet", value: 'nothing' },
            { icon: '→', label: 'Yes — analgesic / antipyretic (Paracetamol…)', value: 'analgesic' },
            { icon: '→', label: 'Yes — antibiotic or prescribed treatment', value: 'antibiotic' },
            { icon: '→', label: 'Yes — other self-medication', value: 'other_meds' },
          ]
        },
        {
          id: 'consulted',
          category: 'History',
          text: 'Have you already consulted a doctor for this problem?',
          type: 'options',
          options: [
            { icon: '→', label: "No, it's the first time", value: 'first_time' },
            { icon: '→', label: "Yes, I have ongoing follow-up", value: 'follow_up' },
            { icon: '→', label: 'Yes, but without improvement', value: 'no_improvement' },
          ]
        },
      ]
    }

    return [
      {
        id: 'identity',
        category: 'Profil patient',
        text: 'Quel est votre âge et votre sexe ?',
        type: 'age_gender'
      },
      {
        id: 'chief_complaint',
        category: 'Motif principal',
        text: "Quel est votre problème principal aujourd'hui ?",
        type: 'options',
        options: [
          { icon: '→', label: 'Fièvre / Frissons / Fatigue intense', value: 'fever' },
          { icon: '→', label: 'Douleur thoracique ou essoufflement', value: 'chest' },
          { icon: '→', label: 'Douleur abdominale', value: 'abdomen' },
          { icon: '→', label: 'Maux de tête intenses / Vertiges', value: 'head' },
          { icon: '→', label: 'Nausées / Vomissements / Diarrhée', value: 'nausea' },
          { icon: '→', label: 'Douleur localisée (dos, membre, articulation)', value: 'pain' },
          { icon: '→', label: 'Plaie / Blessure / Traumatisme', value: 'wound' },
          { icon: '→', label: 'Autre symptôme général', value: 'other' },
        ]
      },
      {
        id: 'pain_location',
        category: 'Localisation',
        text: 'Où se situe principalement votre gêne ou douleur ?',
        type: 'body_zones'
      },
      {
        id: 'duration',
        category: 'Durée',
        text: 'Depuis combien de temps ressentez-vous ces symptômes ?',
        type: 'options',
        options: [
          { icon: '→', label: 'Moins de quelques heures', value: 'hours' },
          { icon: '→', label: 'Depuis 1 à 3 jours', value: 'days_3' },
          { icon: '→', label: 'Depuis 4 à 7 jours', value: 'days_7' },
          { icon: '→', label: "Plus d'une semaine", value: 'weeks' },
        ]
      },
      {
        id: 'severity',
        category: 'Intensité',
        text: "Sur une échelle de 1 à 10, évaluez l'intensité de votre gêne.",
        type: 'scale',
        min: 1,
        max: 10
      },
      {
        id: 'worsening',
        category: 'Évolution',
        text: 'Comment vos symptômes ont-ils évolué depuis le début ?',
        type: 'options',
        options: [
          { icon: '→', label: "Ils s'aggravent", value: 'worse' },
          { icon: '→', label: 'Ils restent stables', value: 'stable' },
          { icon: '→', label: "Ils s'améliorent", value: 'better' },
        ]
      },
      {
        id: 'fever_temp',
        category: 'Température',
        text: 'Avez-vous de la fièvre ? Si oui, à quelle température ?',
        type: 'options',
        options: [
          { icon: '→', label: 'Pas de fièvre (< 37,5°C)', value: 'no_fever' },
          { icon: '→', label: 'Légère (37,5 – 38,4°C)', value: 'low_fever' },
          { icon: '→', label: 'Modérée à élevée (38,5 – 39,9°C)', value: 'high_fever' },
          { icon: '→', label: 'Très élevée (≥ 40°C)', value: 'very_high_fever' },
        ]
      },
      {
        id: 'alarm_signs',
        category: "Signes d'alarme",
        text: "Présentez-vous l'un de ces signes ?",
        type: 'options',
        options: [
          { icon: '→', label: 'Perte de conscience ou confusion soudaine', value: 'consciousness' },
          { icon: '→', label: 'Saignement important ou incontrôlable', value: 'bleeding' },
          { icon: '→', label: 'Difficulté à respirer / oppression thoracique', value: 'breathing' },
          { icon: '→', label: 'Aucun de ces signes', value: 'none_alarm' },
        ]
      },
      {
        id: 'chronic',
        category: 'Antécédents médicaux',
        text: 'Avez-vous des maladies chroniques ou un traitement régulier ?',
        type: 'options',
        options: [
          { icon: '→', label: 'Non, aucun antécédent particulier', value: 'none' },
          { icon: '→', label: 'Oui — problème cardiaque ou diabète', value: 'cardiac_diabetes' },
          { icon: '→', label: 'Oui — problème respiratoire (asthme, BPCO…)', value: 'respiratory' },
          { icon: '→', label: 'Oui — autre traitement en cours', value: 'other_chronic' },
        ]
      },
      {
        id: 'allergies',
        category: 'Allergies connues',
        text: 'Avez-vous des allergies connues ?',
        type: 'options',
        options: [
          { icon: '→', label: 'Non, aucune allergie connue', value: 'no_allergy' },
          { icon: '→', label: 'Oui — allergie médicamenteuse', value: 'drug_allergy' },
          { icon: '→', label: 'Oui — allergie alimentaire', value: 'food_allergy' },
          { icon: '→', label: 'Oui — autre allergie', value: 'other_allergy' },
        ]
      },
      {
        id: 'self_medication',
        category: 'Auto-médication',
        text: 'Avez-vous déjà pris un médicament pour ce problème ?',
        type: 'options',
        options: [
          { icon: '→', label: "Non, rien pour l'instant", value: 'nothing' },
          { icon: '→', label: 'Oui — antalgique / antipyrétique (Doliprane…)', value: 'analgesic' },
          { icon: '→', label: 'Oui — antibiotique ou traitement prescrit', value: 'antibiotic' },
          { icon: '→', label: 'Oui — autre automédication', value: 'other_meds' },
        ]
      },
      {
        id: 'consulted',
        category: 'Historique',
        text: 'Avez-vous déjà consulté un médecin pour ce problème ?',
        type: 'options',
        options: [
          { icon: '→', label: "Non, c'est la première fois", value: 'first_time' },
          { icon: '→', label: "Oui, j'ai un suivi en cours", value: 'follow_up' },
          { icon: '→', label: 'Oui, mais sans amélioration', value: 'no_improvement' },
        ]
      },
    ]
  })

  const bodyZones = computed(() => {
    if (locale.value === 'en') {
      return [
        { icon: '→', label: 'Head / Neck', value: 'head_neck' },
        { icon: '→', label: 'Chest / Thorax', value: 'chest_thorax' },
        { icon: '→', label: 'Heart / Palpitations', value: 'heart' },
        { icon: '→', label: 'Stomach / Abdomen', value: 'abdomen' },
        { icon: '→', label: 'Arm / Shoulder', value: 'arm_shoulder' },
        { icon: '→', label: 'Leg / Knee', value: 'leg_knee' },
        { icon: '→', label: 'Foot / Ankle', value: 'foot_ankle' },
        { icon: '→', label: 'Back / Spine', value: 'back' },
        { icon: '→', label: 'Diffuse / Everywhere', value: 'diffuse' },
      ]
    }
    return [
      { icon: '→', label: 'Tête / Cou', value: 'head_neck' },
      { icon: '→', label: 'Thorax / Poitrine', value: 'chest_thorax' },
      { icon: '→', label: 'Cœur / Palpitations', value: 'heart' },
      { icon: '→', label: 'Ventre / Abdomen', value: 'abdomen' },
      { icon: '→', label: 'Bras / Épaule', value: 'arm_shoulder' },
      { icon: '→', label: 'Jambe / Genou', value: 'leg_knee' },
      { icon: '→', label: 'Pied / Cheville', value: 'foot_ankle' },
      { icon: '→', label: 'Dos / Colonne', value: 'back' },
      { icon: '→', label: 'Diffus / Partout', value: 'diffuse' },
    ]
  })

  return { questions, bodyZones }
}