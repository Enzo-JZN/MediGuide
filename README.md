# MediGuide — Nuxt 4 + Tailwind + OpenMed

## Structure du projet

```
mediguide/
├── pages/
│   └── index.vue               ← Page principale (orchestrateur)
├── components/
│   ├── QuestionCard.vue         ← Composant questionnaire
│   ├── FreeTextAnalyzer.vue     ← Saisie libre NLP OpenMed
│   └── TriageResult.vue         ← Affichage du résultat
├── composables/
│   ├── useQuestionnaire.ts      ← Données des questions
│   └── useTriage.ts             ← Logique d'orientation + appels API
├── server/api/
│   ├── analyze.post.ts          ← POST /api/analyze (OpenMed NLP)
│   └── triage.post.ts           ← POST /api/triage (orientation complète)
├── types/
│   └── index.ts                 ← Types TypeScript partagés
├── assets/css/
│   └── main.css                 ← Tailwind + fonts
├── app.vue                      ← Layout principal (header)
├── nuxt.config.ts
├── tailwind.config.ts
├── package.json
└── .env.example
```

---

## Installation & Lancement

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
# Editer .env et ajouter ta clé OpenMed
```

### 3. Lancer en développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

---

## Technologies

| Composant       | Technologie                     |
|-----------------|---------------------------------|
| Framework       | Nuxt 4 (Vue 3 + Composition API)|
| CSS             | Tailwind CSS v3                 |
| NLP Médical     | OpenMed (BioBERT)               |
| API             | Nuxt Server Routes (Nitro)      |
| Types           | TypeScript                      |
| Fonts           | DM Sans + DM Serif Display      |

---

## Architecture API

| Route            | Méthode | Description                        |
|------------------|---------|------------------------------------|
| `/api/analyze`   | POST    | Analyse texte libre via OpenMed    |
| `/api/triage`    | POST    | Orientation complète (NLP + règles)|

---

## Comportement sans clé OpenMed

Si `OPENMED_API_KEY` est vide ou invalide, l'application bascule automatiquement en **mode règles** — le questionnaire structuré continue de fonctionner normalement sans l'analyse NLP.
