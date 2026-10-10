import React, { createContext, useContext, useState, useEffect } from 'react'

const I18nContext = createContext(null)

export const TRANSLATIONS = {
  en: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.enroll': 'Enroll Events',
    'nav.permissions': 'Event Permissions & OD',
    'nav.history': 'Participation & OD History',
    'nav.registrations': 'My Registrations',
    'nav.clubs': 'Clubs & Join',
    'nav.achievements': 'Achievements Feed',
    'nav.feedback': 'Feedback',
    'nav.profile': 'My Student Profile',
    'nav.facultyProfile': 'My Faculty Profile',
    'nav.adminProfile': 'Admin Profile & System',
    'nav.manageEvents': 'Manage Events',
    'nav.checkin': 'Event Check-in',
    'nav.membershipRequests': 'Membership Requests',
    'nav.odRequests': 'Permission Requests',
    'nav.odProofs': 'Proof Verification',
    'nav.odRecords': 'Official OD Passes',
    'nav.settings': 'Settings & Appearance',
    'nav.multiLinker': 'Multi-Channel Alerts (WhatsApp • SMS • Email)',
    'nav.notificationsHub': 'Multi-Channel Alerts',
    'nav.signOut': 'Sign Out',
    'nav.publicPortal': 'Public Portal',

    // Actions
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.reset': 'Reset Filters',
    'action.exportExcel': 'Export to Excel (.csv)',
    'action.exportPdf': 'Export to PDF',
    'action.submit': 'Submit Request',
    'action.save': 'Save Changes',
    'action.cancel': 'Cancel',
    'action.copy': 'Copy Link',
    'action.copied': 'Copied!',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.approve': 'Approve',
    'action.reject': 'Reject',
    'action.login': 'Login',
    'action.register': 'Register',

    // Titles & Sections
    'title.app': 'Campus Event Hub',
    'title.adminDashboard': 'University Platform Administration',
    'title.studentDirectory': 'Student Scholar Directory',
    'title.odRegister': 'University Official OD Sanction Register',
    'title.multiLinker': 'Multi-Channel Notification Dispatcher & Alerts Hub',
    'title.settings': 'Account Settings & System Personalization',
    'title.appearance': 'Appearance & Theme Customization',

    // Appearance
    'appearance.theme': 'Theme Mode',
    'appearance.light': 'Light Mode',
    'appearance.dark': 'Dark Mode',
    'appearance.accent': 'Theme Accent Palette',
    'appearance.fontSize': 'Font Scaling Size',
    'appearance.fontStyle': 'Typography Style',
    'appearance.language': 'Language / பிராந்தியம் / भाषा'
  },
  ta: {
    // Nav
    'nav.dashboard': 'முகப்பு பலகை',
    'nav.enroll': 'நிகழ்வுகள் பதிவு',
    'nav.permissions': 'நிகழ்வு அனுமதி & OD',
    'nav.history': 'பங்கேற்பு & OD வரலாறு',
    'nav.registrations': 'என் பதிவுகள்',
    'nav.clubs': 'மாணவர் மன்றங்கள்',
    'nav.achievements': 'சாதனைகள் தொகுப்பு',
    'nav.feedback': 'கருத்துகள்',
    'nav.profile': 'மாணவர் சுயவிவரம்',
    'nav.facultyProfile': 'பேராசிரியர் விவரம்',
    'nav.adminProfile': 'நிர்வாக சுயவிவரம்',
    'nav.manageEvents': 'நிகழ்வு மேலாண்மை',
    'nav.checkin': 'நிகழ்வு சரிபார்ப்பு',
    'nav.membershipRequests': 'உறுப்பினர் கோரிக்கைகள்',
    'nav.odRequests': 'OD அனுமதி கோரிக்கைகள்',
    'nav.odProofs': 'சான்றிதழ் சரிபார்ப்பு',
    'nav.odRecords': 'அங்கீகரிக்கப்பட்ட OD பாஸ்கள்',
    'nav.settings': 'அமைப்புகள் & தோற்றம்',
    'nav.multiLinker': 'பல-வழி எச்சரிக்கைகள் (WhatsApp • SMS • மின்னஞ்சல்)',
    'nav.notificationsHub': 'பல-வழி எச்சரிக்கைகள்',
    'nav.signOut': 'வெளியேறு',
    'nav.publicPortal': 'பொது தளம்',

    // Actions
    'action.search': 'தேடுக',
    'action.filter': 'வடிகட்டு',
    'action.reset': 'மீட்டமை',
    'action.exportExcel': 'Excel பதிவிறக்கம் (.csv)',
    'action.exportPdf': 'PDF பதிவிறக்கம்',
    'action.submit': 'கோரிக்கையைச் சமர்ப்பி',
    'action.save': 'சேமிக்க',
    'action.cancel': 'ரத்து செய்',
    'action.copy': 'இணைப்பை நகலெடு',
    'action.copied': 'நகலெடுக்கப்பட்டது!',
    'action.edit': 'திருத்து',
    'action.delete': 'நீக்கு',
    'action.approve': 'ஒப்புதல் அளி',
    'action.reject': 'நிராகரி',
    'action.login': 'உள்நுழைக',
    'action.register': 'பதிவு செய்க',

    // Titles & Sections
    'title.app': 'வளாக நிகழ்வு மையம்',
    'title.adminDashboard': 'பல்கலைக்கழக தள நிர்வாகம்',
    'title.studentDirectory': 'மாணவர் அறிஞர் அடைவு',
    'title.odRegister': 'பல்கலைக்கழக அதிகாரப்பூர்வ OD பதிவுப் புத்தகம்',
    'title.multiLinker': 'பல-வழி அறிவிப்பு அனுப்பு மையம் (WhatsApp • SMS • மின்னஞ்சல்)',
    'title.settings': 'கணக்கு அமைப்புகள் & தனிப்பயனாக்கம்',
    'title.appearance': 'தோற்றம் & வண்ண தனிப்பயனாக்கம்',

    // Appearance
    'appearance.theme': 'தோற்ற முறை',
    'appearance.light': 'பகல் முறை (Light)',
    'appearance.dark': 'இரவு முறை (Dark)',
    'appearance.accent': 'வண்ணத் தட்டு (Accent)',
    'appearance.fontSize': 'எழுத்துரு அளவு',
    'appearance.fontStyle': 'எழுத்துரு பாணி',
    'appearance.language': 'மொழி தேர்வு'
  },
  hi: {
    // Nav
    'nav.dashboard': 'डैशबोर्ड',
    'nav.enroll': 'कार्यक्रम पंजीकरण',
    'nav.permissions': 'इवेंट अनुमति और ओडी (OD)',
    'nav.history': 'भागीदारी और ओडी इतिहास',
    'nav.registrations': 'मेरे पंजीकरण',
    'nav.clubs': 'क्लब और सदस्यता',
    'nav.achievements': 'उपलब्धियां फ़ीड',
    'nav.feedback': 'प्रतिक्रिया',
    'nav.profile': 'छात्र प्रोफ़ाइल',
    'nav.facultyProfile': 'संकाय प्रोफ़ाइल',
    'nav.adminProfile': 'प्रशासन प्रोफ़ाइल',
    'nav.manageEvents': 'कार्यक्रम प्रबंधन',
    'nav.checkin': 'उपस्थिति चेक-इन',
    'nav.membershipRequests': 'सदस्यता अनुरोध',
    'nav.odRequests': 'ओडी अनुमति अनुरोध',
    'nav.odProofs': 'प्रमाण सत्यापन',
    'nav.odRecords': 'आधिकारिक ओडी पास',
    'nav.settings': 'सेटिंग्स और स्वरूप',
    'nav.multiLinker': 'मल्टी-चैनल अलर्ट (व्हाट्सएप • एसएमएस • ईमेल)',
    'nav.notificationsHub': 'मल्टी-चैनल अलर्ट',
    'nav.signOut': 'साइन आउट',
    'nav.publicPortal': 'सार्वजनिक पोर्टल',

    // Actions
    'action.search': 'खोजें',
    'action.filter': 'फ़िल्टर',
    'action.reset': 'रीसेट करें',
    'action.exportExcel': 'Excel डाउनलोड (.csv)',
    'action.exportPdf': 'PDF डाउनलोड',
    'action.submit': 'अनुरोध सबमिट करें',
    'action.save': 'सहेजें',
    'action.cancel': 'रद्द करें',
    'action.copy': 'लिंक कॉपी करें',
    'action.copied': 'कॉपी किया गया!',
    'action.edit': 'संपादित करें',
    'action.delete': 'हटाएं',
    'action.approve': 'स्वीकृत करें',
    'action.reject': 'अस्वीकार करें',
    'action.login': 'लॉगिन करें',
    'action.register': 'पंजीकरण करें',

    // Titles & Sections
    'title.app': 'कैंपस इवेंट हब',
    'title.adminDashboard': 'विश्वविद्यालय प्लेटफॉर्म प्रशासन',
    'title.studentDirectory': 'छात्र विद्वान निर्देशिका',
    'title.odRegister': 'विश्वविद्यालय आधिकारिक ओडी रजिस्टर',
    'title.multiLinker': 'मल्टी-चैनल अधिसूचना प्रेषण और अलर्ट हब',
    'title.settings': 'खाता सेटिंग्स और निजीकरण',
    'title.appearance': 'दिखावट और थीम अनुकूलन',

    // Appearance
    'appearance.theme': 'थीम मोड',
    'appearance.light': 'लाइट मोड',
    'appearance.dark': 'डार्क मोड',
    'appearance.accent': 'थीम एक्सेंट रंग',
    'appearance.fontSize': 'फ़ॉन्ट आकार',
    'appearance.fontStyle': 'टाइपोग्राफी शैली',
    'appearance.language': 'भाषा चयन'
  }
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('ceh_language') || 'en'
    } catch {
      return 'en'
    }
  })

  const setLanguage = (lang) => {
    if (['en', 'ta', 'hi'].includes(lang)) {
      setLanguageState(lang)
      try {
        localStorage.setItem('ceh_language', lang)
      } catch {}
    }
  }

  const t = (key, fallback = '') => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en
    if (dict && dict[key]) {
      return dict[key]
    }
    const defaultDict = TRANSLATIONS.en
    return defaultDict[key] || fallback || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages: ['en', 'ta', 'hi'] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key, fallback) => fallback || key,
      languages: ['en']
    }
  }
  return context
}
