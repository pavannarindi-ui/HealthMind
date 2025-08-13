import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from 'react';
import { LanguageContext, translations, Language, useTranslation } from "@/lib/i18n";
import { LanguageSelector } from "@/components/LanguageSelector";
import Dashboard from "@/pages/Dashboard";
import SymptomChecker from "@/pages/SymptomChecker";
import MedicalChat from "@/pages/MedicalChat";
import OfflineResources from "@/pages/OfflineResources";
import DoctorPortal from "@/pages/DoctorPortal";
import MedicalResources from "@/pages/MedicalResources";
import NotFound from "@/pages/not-found";
import { 
  Stethoscope, 
  MessageSquare, 
  Activity, 
  Shield, 
  User, 
  BookOpen,
  Home,
  Heart,
  Plus,
  Zap
} from "lucide-react";

function Navigation() {
  const [location] = useLocation();
  const { t } = useTranslation();
  
  const navItems = [
    { path: "/", icon: Home, label: t.dashboard },
    { path: "/symptom-checker", icon: Activity, label: t.symptomChecker },
    { path: "/medical-chat", icon: MessageSquare, label: t.medicalChat },
    { path: "/offline-resources", icon: Shield, label: t.offlineResources },
    { path: "/doctor-portal", icon: User, label: t.doctorPortal },
    { path: "/medical-resources", icon: BookOpen, label: t.medicalResources },
  ];

  return (
    <nav className="bg-card/90 backdrop-blur-sm shadow-lg border-b border-primary/20 medical-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Stethoscope className="h-8 w-8 text-primary medical-icon pulse-glow" />
                <Heart className="h-3 w-3 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl font-bold text-primary">MediCare Pro</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  href={path}
                  data-testid={`nav-${path.replace('/', '') || 'dashboard'}`}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    location === path
                      ? "text-primary bg-primary/20 medical-border pulse-glow"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-105"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/symptom-checker" component={SymptomChecker} />
          <Route path="/medical-chat" component={MedicalChat} />
          <Route path="/offline-resources" component={OfflineResources} />
          <Route path="/doctor-portal" component={DoctorPortal} />
          <Route path="/medical-resources" component={MedicalResources} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('medicare-language');
    if (savedLanguage && savedLanguage in translations) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('medicare-language', lang);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage, 
        t: translations[language] 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
