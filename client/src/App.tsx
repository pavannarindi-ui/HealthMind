import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import SymptomChecker from "@/pages/SymptomChecker";
import MedicalChat from "@/pages/MedicalChat";
import OfflineResources from "@/pages/OfflineResources";
import DoctorPortal from "@/pages/DoctorPortal";
import MedicalResources from "@/pages/MedicalResources";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/symptom-checker" component={SymptomChecker} />
      <Route path="/medical-chat" component={MedicalChat} />
      <Route path="/offline-resources" component={OfflineResources} />
      <Route path="/doctor-portal" component={DoctorPortal} />
      <Route path="/medical-resources" component={MedicalResources} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
