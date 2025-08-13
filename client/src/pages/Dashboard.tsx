import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VoiceAssistant from "@/components/VoiceAssistant";
import FollowUpCare from "@/components/FollowUpCare";
import HealthAvatar from "@/components/HealthAvatar";
import { User } from "@shared/schema";
import { 
  Heart, 
  Search, 
  Bot, 
  WifiOff, 
  BriefcaseMedical,
  AlertTriangle,
  Stethoscope
} from "lucide-react";

export default function Dashboard() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Loading your health dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-medical-blue" />
                <span className="text-xl font-bold text-slate-800">MediCare Pro</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-slate-600 hover:text-medical-blue transition-colors">
                Dashboard
              </Link>
              <Link href="/symptom-checker" className="text-slate-600 hover:text-medical-blue transition-colors">
                Symptom Checker
              </Link>
              <Link href="/medical-chat" className="text-slate-600 hover:text-medical-blue transition-colors">
                AI Assistant
              </Link>
              <Link href="/medical-resources" className="text-slate-600 hover:text-medical-blue transition-colors">
                Resources
              </Link>
              <Button className="bg-medical-blue hover:bg-medical-blue-dark" data-testid="profile-button">
                Profile
              </Button>
            </div>

            <button className="md:hidden text-slate-600" data-testid="mobile-menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Banner */}
        <Alert className="mb-8 border-red-200 bg-red-50" data-testid="emergency-banner">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Medical Disclaimer:</strong> This app provides informational content only and is not a substitute for professional medical advice. 
            In case of emergency, call 911 immediately.
          </AlertDescription>
        </Alert>

        {/* Welcome Section with Avatar */}
        <div className="bg-gradient-to-r from-medical-blue to-medical-purple rounded-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'User'}!</h1>
              <p className="text-blue-100 mb-4">Your health journey continues. How can I assist you today?</p>
              
              <VoiceAssistant />
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-8">
              <HealthAvatar user={user} />
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Symptom Checker */}
          <Link href="/symptom-checker">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full" data-testid="card-symptom-checker">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Search className="text-red-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Symptom Checker</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">Analyze symptoms with interactive body mapping and get risk assessments</p>
                <div className="flex items-center text-medical-blue text-sm font-medium">
                  <span>Start Analysis</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* AI Chatbot */}
          <Link href="/medical-chat">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full" data-testid="card-ai-chat">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-medical-blue/10 rounded-lg flex items-center justify-center">
                    <Bot className="text-medical-blue text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">AI Medical Assistant</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">Chat with our AI-powered medical assistant for instant health guidance</p>
                <div className="flex items-center text-medical-blue text-sm font-medium">
                  <span>Start Chat</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Offline Resources */}
          <Link href="/offline-resources">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full" data-testid="card-offline">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-health-green/10 rounded-lg flex items-center justify-center">
                    <WifiOff className="text-health-green text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Offline Mode</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">Access essential medical information without internet connection</p>
                <div className="flex items-center text-health-green text-sm font-medium">
                  <span>Access Now</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Doctor Portal */}
          <Link href="/doctor-portal">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full" data-testid="card-doctor-portal">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-medical-purple/10 rounded-lg flex items-center justify-center">
                    <BriefcaseMedical className="text-medical-purple text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Doctor Portal</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">Professional tools and patient management for healthcare providers</p>
                <div className="flex items-center text-medical-purple text-sm font-medium">
                  <span>Login</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Follow-up Care System */}
        <FollowUpCare userId="user-1" />

        {/* Medical Resources Preview */}
        <Card className="mb-8" data-testid="medical-resources-preview">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Medical Resources</h2>
            <p className="text-slate-600">Reliable health information from trusted medical sources</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="text-red-600 text-2xl" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Emergency Procedures</h3>
                <p className="text-sm text-slate-600 mb-3">CPR, First Aid, and Emergency Response</p>
                <Link href="/offline-resources">
                  <Button variant="outline" size="sm" data-testid="button-emergency-procedures">
                    Access Now
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Drug Information</h3>
                <p className="text-sm text-slate-600 mb-3">Medication details and interactions</p>
                <Link href="/medical-resources">
                  <Button variant="outline" size="sm" data-testid="button-drug-info">
                    Search Drugs
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Health Calculators</h3>
                <p className="text-sm text-slate-600 mb-3">BMI, calories, and health metrics</p>
                <Link href="/medical-resources">
                  <Button variant="outline" size="sm" data-testid="button-health-calculators">
                    Calculate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-medical-blue" />
                <span className="text-xl font-bold">MediCare Pro</span>
              </div>
              <p className="text-slate-300 text-sm">
                Advanced medical assistance at your fingertips. Empowering better health decisions through AI and technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>AI Medical Assistant</li>
                <li>Symptom Checker</li>
                <li>Voice Assistant</li>
                <li>Offline Resources</li>
                <li>Follow-up Care</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Professionals</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Doctor Portal</li>
                <li>Patient Management</li>
                <li>Clinical Tools</li>
                <li>API Documentation</li>
                <li>Integration Support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Emergency</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>For immediate medical attention:</p>
                <p className="text-red-400 font-bold text-lg">Call 911</p>
                <p>Poison Control: 1-800-222-1222</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 MediCare Pro. This app is for informational purposes only and not a substitute for professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
