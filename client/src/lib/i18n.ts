// Multi-language support for Tamil, Telugu, Hindi, and English
export interface Translation {
  // Navigation
  dashboard: string;
  symptomChecker: string;
  medicalChat: string;
  offlineResources: string;
  doctorPortal: string;
  medicalResources: string;
  
  // Common
  loading: string;
  error: string;
  submit: string;
  cancel: string;
  save: string;
  back: string;
  next: string;
  
  // Dashboard
  welcomeMessage: string;
  healthScore: string;
  followUpCare: string;
  quickActions: string;
  recentSymptoms: string;
  
  // Symptom Checker
  selectBodyPart: string;
  describeSymptoms: string;
  painLevel: string;
  duration: string;
  analyzeSymptoms: string;
  riskLevel: string;
  recommendations: string;
  
  // Medical Chat
  askQuestion: string;
  voiceInput: string;
  typing: string;
  medicalDisclaimer: string;
  
  // Voice Assistant
  listening: string;
  processing: string;
  speaking: string;
  startListening: string;
  stopListening: string;
  
  // Offline Resources
  emergencyContacts: string;
  firstAid: string;
  commonConditions: string;
  medications: string;
  
  // Doctor Portal
  doctorLogin: string;
  licenseNumber: string;
  pin: string;
  login: string;
  patientRecords: string;
  
  // Medical conditions
  fever: string;
  cold: string;
  cough: string;
  headache: string;
  stomachache: string;
  nausea: string;
  dizziness: string;
  fatigue: string;
}

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    symptomChecker: "Symptom Checker",
    medicalChat: "Medical Chat",
    offlineResources: "Offline Resources",
    doctorPortal: "Doctor Portal",
    medicalResources: "Medical Resources",
    
    // Common
    loading: "Loading...",
    error: "Error",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    back: "Back",
    next: "Next",
    
    // Dashboard
    welcomeMessage: "Welcome to MediCare Pro",
    healthScore: "Health Score",
    followUpCare: "Follow-up Care",
    quickActions: "Quick Actions",
    recentSymptoms: "Recent Symptoms",
    
    // Symptom Checker
    selectBodyPart: "Select Body Part",
    describeSymptoms: "Describe Your Symptoms",
    painLevel: "Pain Level",
    duration: "Duration",
    analyzeSymptoms: "Analyze Symptoms",
    riskLevel: "Risk Level",
    recommendations: "Recommendations",
    
    // Medical Chat
    askQuestion: "Ask a medical question...",
    voiceInput: "Voice Input",
    typing: "AI is typing...",
    medicalDisclaimer: "This is for informational purposes only. Consult a healthcare professional for medical advice.",
    
    // Voice Assistant
    listening: "Listening...",
    processing: "Processing...",
    speaking: "Speaking...",
    startListening: "Start Listening",
    stopListening: "Stop Listening",
    
    // Offline Resources
    emergencyContacts: "Emergency Contacts",
    firstAid: "First Aid",
    commonConditions: "Common Conditions",
    medications: "Medications",
    
    // Doctor Portal
    doctorLogin: "Doctor Login",
    licenseNumber: "License Number",
    pin: "PIN",
    login: "Login",
    patientRecords: "Patient Records",
    
    // Medical conditions
    fever: "Fever",
    cold: "Cold",
    cough: "Cough",
    headache: "Headache",
    stomachache: "Stomach Ache",
    nausea: "Nausea",
    dizziness: "Dizziness",
    fatigue: "Fatigue",
  },
  
  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    symptomChecker: "लक्षण जांचकर्ता",
    medicalChat: "मेडिकल चैट",
    offlineResources: "ऑफलाइन संसाधन",
    doctorPortal: "डॉक्टर पोर्टल",
    medicalResources: "चिकित्सा संसाधन",
    
    // Common
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    submit: "जमा करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    back: "वापस",
    next: "अगला",
    
    // Dashboard
    welcomeMessage: "मेडिकेयर प्रो में आपका स्वागत है",
    healthScore: "स्वास्थ्य स्कोर",
    followUpCare: "फॉलो-अप केयर",
    quickActions: "त्वरित कार्य",
    recentSymptoms: "हाल के लक्षण",
    
    // Symptom Checker
    selectBodyPart: "शरीर का हिस्सा चुनें",
    describeSymptoms: "अपने लक्षणों का वर्णन करें",
    painLevel: "दर्द का स्तर",
    duration: "अवधि",
    analyzeSymptoms: "लक्षणों का विश्लेषण करें",
    riskLevel: "जोखिम का स्तर",
    recommendations: "सिफारिशें",
    
    // Medical Chat
    askQuestion: "एक चिकित्सा प्रश्न पूछें...",
    voiceInput: "आवाज इनपुट",
    typing: "AI टाइप कर रहा है...",
    medicalDisclaimer: "यह केवल जानकारी के लिए है। चिकित्सा सलाह के लिए स्वास्थ्य पेशेवर से सलाह लें।",
    
    // Voice Assistant
    listening: "सुन रहा है...",
    processing: "प्रसंस्करण...",
    speaking: "बोल रहा है...",
    startListening: "सुनना शुरू करें",
    stopListening: "सुनना बंद करें",
    
    // Offline Resources
    emergencyContacts: "आपातकालीन संपर्क",
    firstAid: "प्राथमिक चिकित्सा",
    commonConditions: "सामान्य स्थितियां",
    medications: "दवाएं",
    
    // Doctor Portal
    doctorLogin: "डॉक्टर लॉगिन",
    licenseNumber: "लाइसेंस नंबर",
    pin: "पिन",
    login: "लॉगिन",
    patientRecords: "मरीज़ के रिकॉर्ड",
    
    // Medical conditions
    fever: "बुखार",
    cold: "सर्दी",
    cough: "खांसी",
    headache: "सिरदर्द",
    stomachache: "पेट दर्द",
    nausea: "मतली",
    dizziness: "चक्कर आना",
    fatigue: "थकान",
  },
  
  ta: {
    // Navigation
    dashboard: "டாஷ்போர்டு",
    symptomChecker: "அறிகுறி சரிபார்ப்பவர்",
    medicalChat: "மருத்துவ சாட்",
    offlineResources: "ஆஃப்லைன் வளங்கள்",
    doctorPortal: "மருத்துவர் போர்ட்டல்",
    medicalResources: "மருத்துவ வளங்கள்",
    
    // Common
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    submit: "சமர்ப்பிக்கவும்",
    cancel: "ரத்து செய்",
    save: "சேமி",
    back: "பின்",
    next: "அடுத்து",
    
    // Dashboard
    welcomeMessage: "மெடிகேர் ப்ரோவில் உங்களை வரவேற்கிறோம்",
    healthScore: "சுகாதார மதிப்பெண்",
    followUpCare: "தொடர் பராமரிப்பு",
    quickActions: "விரைவு செயல்கள்",
    recentSymptoms: "சமீபத்திய அறிகுறிகள்",
    
    // Symptom Checker
    selectBodyPart: "உடல் பாகத்தை தேர்ந்தெடுக்கவும்",
    describeSymptoms: "உங்கள் அறிகுறிகளை விவரிக்கவும்",
    painLevel: "வலி நிலை",
    duration: "கால அளவு",
    analyzeSymptoms: "அறிகுறிகளை பகுப்பாய்வு செய்யவும்",
    riskLevel: "ஆபத்து நிலை",
    recommendations: "பரிந்துரைகள்",
    
    // Medical Chat
    askQuestion: "ஒரு மருத்துவ கேள்வி கேளுங்கள்...",
    voiceInput: "குரல் உள்ளீடு",
    typing: "AI டைப் செய்கிறது...",
    medicalDisclaimer: "இது தகவல் நோக்கங்களுக்காக மட்டுமே. மருத்துவ ஆலோசனைக்கு சுகாதார நிபுணரை அணுகவும்.",
    
    // Voice Assistant
    listening: "கேட்கிறது...",
    processing: "செயலாக்கம்...",
    speaking: "பேசுகிறது...",
    startListening: "கேட்க ஆரம்பிக்கவும்",
    stopListening: "கேட்பதை நிறுத்தவும்",
    
    // Offline Resources
    emergencyContacts: "அவசர தொடர்புகள்",
    firstAid: "முதலுதவி",
    commonConditions: "பொதுவான நிலைமைகள்",
    medications: "மருந்துகள்",
    
    // Doctor Portal
    doctorLogin: "மருத்துவர் உள்நுழைவு",
    licenseNumber: "உரிம எண்",
    pin: "பின்",
    login: "உள்நுழைவு",
    patientRecords: "நோயாளி பதிவுகள்",
    
    // Medical conditions
    fever: "காய்ச்சல்",
    cold: "சளி",
    cough: "இருமல்",
    headache: "தலைவலி",
    stomachache: "வயிற்று வலி",
    nausea: "குமட்டல்",
    dizziness: "தலைச்சுற்றல்",
    fatigue: "சோர்வு",
  },
  
  te: {
    // Navigation
    dashboard: "డ్యాష్‌బోర్డ్",
    symptomChecker: "లక్షణ తనిఖీ",
    medicalChat: "వైద్య చాట్",
    offlineResources: "ఆఫ్‌లైన్ వనరులు",
    doctorPortal: "డాక్టర్ పోర్టల్",
    medicalResources: "వైద్య వనరులు",
    
    // Common
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం",
    submit: "సమర్పించు",
    cancel: "రద్దు చేయి",
    save: "సేవ్ చేయి",
    back: "వెనుకకు",
    next: "తరువాత",
    
    // Dashboard
    welcomeMessage: "మెడికేర్ ప్రోకు స్వాగతం",
    healthScore: "ఆరోగ్య స్కోర్",
    followUpCare: "ఫాలో-అప్ కేర్",
    quickActions: "త్వరిత చర్యలు",
    recentSymptoms: "ఇటీవలి లక్షణాలు",
    
    // Symptom Checker
    selectBodyPart: "శరీర భాగాన్ని ఎంచుకోండి",
    describeSymptoms: "మీ లక్షణాలను వివరించండి",
    painLevel: "నొప్పి స్థాయి",
    duration: "వ్యవధి",
    analyzeSymptoms: "లక్షణాలను విశ్లేషించండి",
    riskLevel: "ప్రమాద స్థాయి",
    recommendations: "సిఫార్సులు",
    
    // Medical Chat
    askQuestion: "వైద్య ప్రశ్న అడగండి...",
    voiceInput: "వాయిస్ ఇన్‌పుట్",
    typing: "AI టైప్ చేస్తోంది...",
    medicalDisclaimer: "ఇది సమాచార ప్రయోజనాల కోసం మాత్రమే. వైద్య సలహా కోసం ఆరోగ్య నిపుణుడిని సంప్రదించండి.",
    
    // Voice Assistant
    listening: "వింటోంది...",
    processing: "ప్రాసెసింగ్...",
    speaking: "మాట్లాడుతోంది...",
    startListening: "వినడం ప్రారంభించండి",
    stopListening: "వినడం ఆపండి",
    
    // Offline Resources
    emergencyContacts: "అత్యవసర సంప్రదింపులు",
    firstAid: "ప్రథమ చికిత్స",
    commonConditions: "సాధారణ పరిస్థితులు",
    medications: "మందులు",
    
    // Doctor Portal
    doctorLogin: "డాక్టర్ లాగిన్",
    licenseNumber: "లైసెన్స్ నంబర్",
    pin: "పిన్",
    login: "లాగిన్",
    patientRecords: "రోగి రికార్డులు",
    
    // Medical conditions
    fever: "జ్వరం",
    cold: "జలుబు",
    cough: "దగ్గు",
    headache: "తలనొప్పి",
    stomachache: "కడుపునొప్పి",
    nausea: "వాంతులు",
    dizziness: "తలతిరుగుట",
    fatigue: "అలసట",
  },
};

export type Language = keyof typeof translations;

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
];

// Language context
import { createContext, useContext } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};