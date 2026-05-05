import { ref, watch } from 'vue'

const currentLanguage = ref(localStorage.getItem('yieldguard-lang') || 'en')

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Live Monitor',
    'nav.history': 'History',
    'nav.assistant': 'AI Assistant',
    'nav.map': 'Warehouse Map',
    'nav.settings': 'Settings',
    // Header
    'header.search': 'Select Warehouse / Zone',
    'header.notifications': 'Notifications',
    'header.clearAll': 'Clear All',
    'header.allOptimal': 'All systems optimal. No recent alerts.',
    // Auth
    'auth.back': 'Back to Website',
    'auth.backShort': 'Back',
    'auth.loginTitle': 'Log in to account',
    'auth.signupTitle': 'Create an account',
    'auth.resetTitle': 'Reset password',
    'auth.loginSub': 'Enter your details to access your dashboard.',
    'auth.signupSub': 'Start monitoring your storage environment today.',
    'auth.resetSub': 'We will send you instructions to reset your password.',
    'auth.fullName': 'Full Name',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.forgot': 'Forgot Password?',
    'auth.btnLogin': 'Log In',
    'auth.btnSignup': 'Create Account',
    'auth.btnReset': 'Send Reset Link',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.orContinue': 'Or continue with',
    'auth.google': 'Sign in with Google',
    'auth.apple': 'Sign in with Apple',
    // Landing
    'landing.features': 'Features',
    'landing.founders': 'Founders',
    'landing.pricing': 'Pricing',
    'landing.testimonials': 'Testimonials',
    'landing.heroTag': 'SMART WAREHOUSE AI',
    'landing.heroTitle': 'Secure Your Coffee Yield with Precision Analytics',
    'landing.heroSub': 'We provide a smart, automated sensor network to monitor temperature and humidity, ensuring your premium coffee beans never suffer from mold or drying.',
    'landing.getStarted': 'Get Started',
    'landing.howItWorks': 'How it Works',
    'landing.statsBeans': 'Beans Protected',
    'landing.statsSensors': 'Active Sensors',
    'landing.statsUptime': 'System Uptime',
    // Settings
    'settings.title': 'System Settings',
    'settings.sub': 'Configure alerts and environmental thresholds',
    'settings.save': 'Save Changes',
    'settings.saving': 'Saving...',
    'settings.saved': 'Saved!',
    'settings.thresholds': 'Environmental Thresholds',
    'settings.thresholdsSub': 'These values determine when the hardware ESP32 triggers alerts. Currently, these are interface-only and must match your flashed hardware constants.',
    'settings.alerts': 'Alert Preferences',
    'settings.langPrefs': 'Language Preferences',
    'settings.dashLang': 'Dashboard Language',
    'settings.dashLangSub': 'Select your preferred language for the interface.',
  },
  lg: {
    // Navigation
    'nav.dashboard': 'Ebigobererwa (Monitor)',
    'nav.history': 'Ebyakayita',
    'nav.assistant': 'Amagezi g\'Ekyuma (AI)',
    'nav.map': 'Maapu Y\'Eterekero',
    'nav.settings': 'Enteekateeka',
    // Header
    'header.search': 'Londa Eterekero / Ekitundu',
    'header.notifications': 'Okutegeezebwa',
    'header.clearAll': 'Ggyawo Byonna',
    'header.allOptimal': 'Byonna bitambula bulungi. Tewali buzibu.',
    // Auth
    'auth.back': 'Dda ku Muko',
    'auth.backShort': 'Dda Mabega',
    'auth.loginTitle': 'Yingira mu Akawunti',
    'auth.signupTitle': 'Kola Akawunti',
    'auth.resetTitle': 'Zzaawo Ebisumuluzo',
    'auth.loginSub': 'Yingiza ebikukwatako okutuuka ku dashboard yo.',
    'auth.signupSub': 'Tandika okulondoola embera z\'eterekero lyo leero.',
    'auth.resetSub': 'Tujja kukuweereza obubaka obuzzaawo ebisumuluzo.',
    'auth.fullName': 'Amanya Mampuyi',
    'auth.email': 'Ennamba ya Email',
    'auth.password': 'Ekisumuluzo',
    'auth.forgot': 'Oyerabidde Ekisumuluzo?',
    'auth.btnLogin': 'Yingira',
    'auth.btnSignup': 'Kola Akawunti',
    'auth.btnReset': 'Saba Ebisumuluzo Ebigya',
    'auth.noAccount': 'Tolina akawunti?',
    'auth.hasAccount': 'Olina akawunti edda?',
    'auth.orContinue': 'Oba yingira ne',
    'auth.google': 'Yingira ne Google',
    'auth.apple': 'Yingira ne Apple',
    // Landing
    'landing.features': 'Ebirimu',
    'landing.founders': 'Abaatandikawo',
    'landing.pricing': 'Ebisale',
    'landing.testimonials': 'Obujulizi',
    'landing.heroTag': 'AMAGEZI G\'ETEREKERO',
    'landing.heroTitle': 'Kuuma Ebirime byo eby\'Emmwaanyi N\'amagezi',
    'landing.heroSub': 'Tuwaayo ebyuma ebikebera obunnyogovu n\'ebbugumu okukakasa nti emmwaanyi zo teziyonooneka nga zivunda oba okukala ennyo.',
    'landing.getStarted': 'Tandika Kati',
    'landing.howItWorks': 'Engeri Gye Kikolamu',
    'landing.statsBeans': 'Emmwaanyi Eziwoneddwa',
    'landing.statsSensors': 'Ebyuma Ebikola',
    'landing.statsUptime': 'Obudde bw\'Okukola',
    // Settings
    'settings.title': 'Enteekateeka z\'Ebyuma',
    'settings.sub': 'Teekawo endabula n\'obungi bw\'ebbugumu/obunnyogovu',
    'settings.save': 'Kuumayo',
    'settings.saving': 'Tereka...',
    'settings.saved': 'Kiterekeddwa!',
    'settings.thresholds': 'Enteekateeka z\'Ebbugumu',
    'settings.thresholdsSub': 'Bino byebipima bya ESP32 ebiwa endabula.',
    'settings.alerts': 'Enteekateeka z\'Endabula',
    'settings.langPrefs': 'Enteekateeka z\'Olwimi',
    'settings.dashLang': 'Olwimi lwa Dashboard',
    'settings.dashLangSub': 'Londa olwimi lw\'osinga okwagala.',
  },
  sw: {
    // Navigation
    'nav.dashboard': 'Ufuatiliaji',
    'nav.history': 'Historia',
    'nav.assistant': 'Msaidizi wa AI',
    'nav.map': 'Ramani ya Ghala',
    'nav.settings': 'Mipangilio',
    // Header
    'header.search': 'Chagua Ghala / Sehemu',
    'header.notifications': 'Arifa',
    'header.clearAll': 'Futa Zote',
    'header.allOptimal': 'Mifumo yote iko sawa. Hakuna arifa mpya.',
    // Auth
    'auth.back': 'Rudi kwa Tovuti',
    'auth.backShort': 'Nyuma',
    'auth.loginTitle': 'Ingia kwenye akaunti',
    'auth.signupTitle': 'Fungua akaunti',
    'auth.resetTitle': 'Weka upya nenosiri',
    'auth.loginSub': 'Ingiza maelezo yako kufikia dashibodi yako.',
    'auth.signupSub': 'Anza kufuatilia mazingira ya ghala lako leo.',
    'auth.resetSub': 'Tutakutumia maelekezo ya kuweka upya nenosiri.',
    'auth.fullName': 'Jina Kamili',
    'auth.email': 'Barua Pepe',
    'auth.password': 'Nenosiri',
    'auth.forgot': 'Umesahau Nenosiri?',
    'auth.btnLogin': 'Ingia',
    'auth.btnSignup': 'Fungua Akaunti',
    'auth.btnReset': 'Tuma Kiungo',
    'auth.noAccount': 'Hauna akaunti?',
    'auth.hasAccount': 'Tayari una akaunti?',
    'auth.orContinue': 'Au endelea na',
    'auth.google': 'Ingia na Google',
    'auth.apple': 'Ingia na Apple',
    // Landing
    'landing.features': 'Vipengele',
    'landing.founders': 'Waanzilishi',
    'landing.pricing': 'Bei',
    'landing.testimonials': 'Ushuhuda',
    'landing.heroTag': 'AI YA GHALA KISASA',
    'landing.heroTitle': 'Linda Mavuno yako ya Kahawa kwa Uchambuzi Sahihi',
    'landing.heroSub': 'Tunatoa mtandao wa sensa kufuatilia joto na unyevu, kuhakikisha kahawa yako haiharibiki kwa ukungu au kukauka sana.',
    'landing.getStarted': 'Anza Sasa',
    'landing.howItWorks': 'Jinsi Inavyofanya Kazi',
    'landing.statsBeans': 'Kahawa Iliyolindwa',
    'landing.statsSensors': 'Sensa Zinazofanya Kazi',
    'landing.statsUptime': 'Muda wa Kufanya Kazi',
    // Settings
    'settings.title': 'Mipangilio ya Mfumo',
    'settings.sub': 'Sanidi arifa na mipaka ya mazingira',
    'settings.save': 'Hifadhi',
    'settings.saving': 'Inahifadhi...',
    'settings.saved': 'Imehifadhiwa!',
    'settings.thresholds': 'Mipaka ya Mazingira',
    'settings.thresholdsSub': 'Maadili haya yanaamua wakati ESP32 inaleta arifa.',
    'settings.alerts': 'Mapendeleo ya Arifa',
    'settings.langPrefs': 'Mapendeleo ya Lugha',
    'settings.dashLang': 'Lugha ya Dashibodi',
    'settings.dashLangSub': 'Chagua lugha unayopendelea kwa kiolesura.',
  }
}

export function useLanguage() {
  const setLanguage = (lang) => {
    if (['en', 'lg', 'sw'].includes(lang)) {
      currentLanguage.value = lang
    }
  }

  const t = (key) => {
    const lang = currentLanguage.value || 'en'
    return translations[lang]?.[key] || translations['en']?.[key] || key
  }

  // Persist language to localStorage
  watch(currentLanguage, (newLang) => {
    localStorage.setItem('yieldguard-lang', newLang)
  })

  return {
    currentLanguage,
    setLanguage,
    t,
    languages: [
      { code: 'en', name: 'English', short: 'EN' },
      { code: 'lg', name: 'Luganda', short: 'LG' },
      { code: 'sw', name: 'Swahili', short: 'SW' }
    ]
  }
}
