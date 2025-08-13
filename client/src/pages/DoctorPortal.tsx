import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { doctorLoginSchema, type DoctorLogin } from "@shared/schema";
import { Heart, ArrowLeft, BriefcaseMedical, Shield, Users, FileText, BarChart3, Settings, AlertTriangle } from "lucide-react";

interface DoctorDashboard {
  success: boolean;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    isVerified: boolean;
  };
}

export default function DoctorPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctor, setDoctor] = useState<DoctorDashboard['doctor'] | null>(null);
  const { toast } = useToast();

  const form = useForm<DoctorLogin>({
    resolver: zodResolver(doctorLoginSchema),
    defaultValues: {
      licenseNumber: "",
      pin: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: DoctorLogin) => {
      const response = await apiRequest("POST", "/api/doctor-login", data);
      return response.json();
    },
    onSuccess: (data: DoctorDashboard) => {
      if (data.success) {
        setIsLoggedIn(true);
        setDoctor(data.doctor);
        toast({
          title: "Login Successful",
          description: `Welcome, Dr. ${data.doctor.firstName} ${data.doctor.lastName}`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDoctor(null);
    form.reset();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const onSubmit = (data: DoctorLogin) => {
    loginMutation.mutate(data);
  };

  if (isLoggedIn && doctor) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" data-testid="button-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-medical-blue" />
                  <span className="text-lg font-bold text-slate-800">Doctor Portal</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </p>
                  <p className="text-xs text-slate-600">{doctor.specialty}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Doctor Verification Status */}
          {!doctor.isVerified && (
            <Alert className="mb-8 border-amber-200 bg-amber-50" data-testid="verification-alert">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Your account is pending verification. Some features may be limited until verification is complete.
              </AlertDescription>
            </Alert>
          )}

          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-medical-purple to-medical-blue rounded-xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="text-purple-100 mb-4">
                  {doctor.specialty} • Professional Healthcare Portal
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className={`w-5 h-5 ${doctor.isVerified ? 'text-green-300' : 'text-yellow-300'}`} />
                    <span className="text-sm">
                      {doctor.isVerified ? 'Verified Professional' : 'Verification Pending'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
                  <BriefcaseMedical className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Patient Management */}
            <Card className="hover:shadow-md transition-shadow" data-testid="card-patient-management">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="w-5 h-5 mr-2 text-medical-blue" />
                  Patient Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  Manage patient records, appointments, and treatment plans
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Active Patients</span>
                    <span className="font-medium text-slate-800">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Pending Reviews</span>
                    <span className="font-medium text-slate-800">7</span>
                  </div>
                </div>
                <Button className="w-full" data-testid="button-patient-management">
                  Access Patient Portal
                </Button>
              </CardContent>
            </Card>

            {/* Clinical Analytics */}
            <Card className="hover:shadow-md transition-shadow" data-testid="card-clinical-analytics">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="w-5 h-5 mr-2 text-health-green" />
                  Clinical Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  View treatment outcomes, patient trends, and performance metrics
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Recovery Rate</span>
                    <span className="font-medium text-health-green">94.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Patient Satisfaction</span>
                    <span className="font-medium text-health-green">4.8/5</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" data-testid="button-clinical-analytics">
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Medical Resources */}
            <Card className="hover:shadow-md transition-shadow" data-testid="card-medical-resources">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-medical-amber" />
                  Medical Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  Access clinical guidelines, drug databases, and medical references
                </p>
                <div className="space-y-2 mb-4">
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-drug-database">
                    <span className="text-xs">💊</span>
                    <span className="ml-2">Drug Database</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-clinical-guidelines">
                    <span className="text-xs">📋</span>
                    <span className="ml-2">Clinical Guidelines</span>
                  </Button>
                </div>
                <Button variant="outline" className="w-full" data-testid="button-all-resources">
                  All Resources
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Professional Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <p className="text-slate-600">Common professional tasks and tools</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col" data-testid="button-new-prescription">
                    <span className="text-2xl mb-1">💊</span>
                    <span className="text-xs">New Prescription</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col" data-testid="button-schedule-appointment">
                    <span className="text-2xl mb-1">📅</span>
                    <span className="text-xs">Schedule</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col" data-testid="button-lab-results">
                    <span className="text-2xl mb-1">🧪</span>
                    <span className="text-xs">Lab Results</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col" data-testid="button-referrals">
                    <span className="text-2xl mb-1">📤</span>
                    <span className="text-xs">Referrals</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-slate-600">Latest patient interactions and system updates</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-medical-blue rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Patient consultation completed</p>
                      <p className="text-xs text-slate-600">Sarah Johnson - 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-health-green rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Lab results reviewed</p>
                      <p className="text-xs text-slate-600">Michael Chen - 4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-medical-amber rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Prescription updated</p>
                      <p className="text-xs text-slate-600">Emma Davis - 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-medical-blue" />
                <span className="text-lg font-bold text-slate-800">Doctor Portal</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-16">
        <Card data-testid="doctor-login-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-medical-purple/10 rounded-full flex items-center justify-center mb-4">
              <BriefcaseMedical className="w-8 h-8 text-medical-purple" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Healthcare Provider Portal
            </CardTitle>
            <p className="text-slate-600">Secure access for licensed healthcare professionals</p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical License Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="Enter your license number"
                          data-testid="input-license-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secure PIN</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          placeholder="Enter your PIN"
                          data-testid="input-pin"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" data-testid="checkbox-remember" />
                  <label htmlFor="remember" className="text-sm text-slate-600">
                    Keep me signed in on this device
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-medical-purple hover:bg-purple-700"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Access Professional Tools
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                By accessing this portal, you agree to maintain patient confidentiality and comply with HIPAA regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
