// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

  // Server routes pour l'API OpenMed
  nitro: {
    experimental: {
      openAPI: true
    }
  },

  // Variables d'environnement
  runtimeConfig: {
    // Côté serveur uniquement (jamais exposé au navigateur)
    mistralApiKey: process.env.MISTRAL_API_KEY || '',
    // Côté public
    public: {
      appName: 'MediGuide'
    }
  }
})
