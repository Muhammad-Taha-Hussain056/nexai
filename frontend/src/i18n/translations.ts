export type LanguageCode =
  | 'US'
  | 'SA'
  | 'FR'
  | 'DE'
  | 'ES'
  | 'BR'
  | 'CN'
  | 'JP'
  | 'KR'
  | 'IN'
  | 'PK'
  | 'TR'
  | 'RU'
  | 'IT'
  | 'NL';

export type TranslationKey =
  | 'nav.chatHub'
  | 'nav.marketplace'
  | 'nav.agents'
  | 'nav.discoverNew'
  | 'nav.signIn'
  | 'nav.tryFree'
  | 'lang.appLanguage'
  | 'home.hero.titleLine1'
  | 'home.hero.titleHighlight'
  | 'home.hero.titleLine2'
  | 'home.hero.subtitle'
  | 'home.hero.letsGo'
  | 'home.featuredModels'
  | 'home.browseAll'
  | 'onboarding.welcomeTitle'
  | 'onboarding.welcomeBody'
  | 'onboarding.getStarted'
  | 'onboarding.skip'
  | 'onboarding.quickQuestion'
  | 'onboarding.quickPrompt'
  | 'onboarding.continue'
  | 'onboarding.skipSearch'
  | 'onboarding.doneTitle'
  | 'onboarding.doneBody'
  | 'onboarding.goToHub';

type TranslationMap = Record<TranslationKey, string>;

const english: TranslationMap = {
  'nav.chatHub': 'Chat Hub',
  'nav.marketplace': 'Marketplace',
  'nav.agents': 'Agents',
  'nav.discoverNew': 'Discover New',
  'nav.signIn': 'Sign in',
  'nav.tryFree': 'Try free ->',
  'lang.appLanguage': 'APP LANGUAGE',
  'home.hero.titleLine1': 'Find your perfect',
  'home.hero.titleHighlight': 'AI model',
  'home.hero.titleLine2': 'with guided discovery',
  'home.hero.subtitle':
    "You don't need to know anything about AI to get started. Just click the box below — we'll do the rest together. ✨",
  'home.hero.letsGo': "Let's go",
  'home.featuredModels': 'Featured Models',
  'home.browseAll': 'Browse all 525 ->',
  'onboarding.welcomeTitle': 'Welcome to NexusAI 👋',
  'onboarding.welcomeBody':
    'We will guide you step by step and match you with the right AI flow in under a minute.',
  'onboarding.getStarted': "Let's get started",
  'onboarding.skip': 'Skip this',
  'onboarding.quickQuestion': 'Quick question',
  'onboarding.quickPrompt': 'What would you like to do today?',
  'onboarding.continue': 'Continue',
  'onboarding.skipSearch': 'Skip - search directly',
  'onboarding.doneTitle': "You're all set!",
  'onboarding.doneBody': 'Taking you to your personalised hub...',
  'onboarding.goToHub': 'Go to Hub',
};

const spanish: Partial<TranslationMap> = {
  'nav.chatHub': 'Centro de Chat',
  'nav.marketplace': 'Mercado',
  'nav.agents': 'Agentes',
  'nav.discoverNew': 'Descubrir',
  'nav.signIn': 'Iniciar sesion',
  'nav.tryFree': 'Probar gratis ->',
  'lang.appLanguage': 'IDIOMA DE LA APP',
  'home.hero.letsGo': 'Comenzar',
  'home.featuredModels': 'Modelos destacados',
  'onboarding.quickQuestion': 'Pregunta rapida',
  'onboarding.continue': 'Continuar',
  'onboarding.goToHub': 'Ir al Hub',
};

const french: Partial<TranslationMap> = {
  'nav.chatHub': 'Hub Chat',
  'nav.marketplace': 'Marche',
  'nav.agents': 'Agents',
  'nav.discoverNew': 'Decouvrir',
  'nav.signIn': 'Se connecter',
  'nav.tryFree': 'Essayer gratuit ->',
  'lang.appLanguage': "LANGUE DE L'APP",
  'home.hero.letsGo': 'Demarrer',
  'onboarding.quickQuestion': 'Question rapide',
  'onboarding.continue': 'Continuer',
};

const overridesByLanguage: Partial<Record<LanguageCode, Partial<TranslationMap>>> = {
  ES: spanish,
  FR: french,
};

export function translate(lang: LanguageCode, key: TranslationKey): string {
  const override = overridesByLanguage[lang]?.[key];
  if (override) return override;
  return english[key];
}
