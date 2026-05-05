<template>
  <div class="min-h-screen bg-slate-100 flex flex-col items-center">

    <header class="w-full bg-white border-b border-slate-200 px-8 flex items-center justify-between h-16 sticky top-0 z-50 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <span class="font-bold text-slate-800 text-xl tracking-tight">MediGuide</span>
      </div>
      <span class="text-xs text-slate-500 border border-slate-200 px-3 py-1 rounded-full font-medium">
        Outil d'orientation, pas un diagnostic
      </span>
    </header>

    <main class="w-full max-w-3xl px-6 py-10 pb-20 flex flex-col gap-6">
      <NuxtPage />
    </main>

  </div>
</template>