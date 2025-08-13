import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, Phone, FileText, PillBottle, Utensils, Moon, Activity } from "lucide-react";

interface RiskAssessmentResult {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  diagnosis: string;
  confidence: number;
  recommendations: {
    medications?: string[];
    diet?: string[];
    lifestyle?: string[];
    followUp?: string[];
  };
  urgentCare: boolean;
  emergencySignals: string[];
  recordId: string;
}

interface RiskAssessmentProps {
  result: RiskAssessmentResult;
  className?: string;
}

export default function RiskAssessment({ result, className = "" }: RiskAssessmentProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-200";
      case "CRITICAL": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "LOW": return <CheckCircle className="w-6 h-6" />;
      case "MEDIUM": return <Clock className="w-6 h-6" />;
      case "HIGH": return <AlertTriangle className="w-6 h-6" />;
      case "CRITICAL": return <AlertTriangle className="w-6 h-6" />;
      default: return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getRiskDescription = (level: string) => {
    switch (level) {
      case "LOW": return "Low risk - Monitor symptoms and consider self-care measures";
      case "MEDIUM": return "Moderate risk - Consider consulting a healthcare provider within a few days";
      case "HIGH": return "High risk - Seek medical attention within 24 hours";
      case "CRITICAL": return "Critical risk - Seek immediate emergency medical care";
      default: return "Assessment completed";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Urgent Care Alert */}
      {result.urgentCare && (
        <Alert className="border-red-200 bg-red-50" data-testid="urgent-care-alert">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>URGENT MEDICAL ATTENTION RECOMMENDED:</strong> Based on your symptoms, you should seek immediate medical care. 
            If this is an emergency, call 911 immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Risk Level Assessment */}
      <Card data-testid="risk-assessment-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">Symptom Analysis Results</CardTitle>
          <p className="text-slate-600">AI-powered assessment based on your reported symptoms</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Level */}
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 border-2 ${getRiskColor(result.riskLevel)}`}>
                <div className="text-center">
                  {getRiskIcon(result.riskLevel)}
                  <div className="text-sm font-bold mt-1">{result.riskLevel}</div>
                </div>
              </div>
              
              <Badge className={getRiskColor(result.riskLevel)} data-testid="risk-level-badge">
                Risk Level: {result.riskLevel}
              </Badge>
              
              <p className="text-sm text-slate-600 mt-2">
                {getRiskDescription(result.riskLevel)}
              </p>
              
              <div className="mt-4">
                <div className="text-sm text-slate-500 mb-1">Confidence Level</div>
                <div className="text-2xl font-bold text-medical-blue">
                  {Math.round(result.confidence * 100)}%
                </div>
              </div>
            </div>

            {/* Diagnosis Information */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-medical-blue" />
                    Possible Conditions
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-800">{result.diagnosis}</p>
                  </div>
                </div>

                {/* Emergency Signals */}
                {result.emergencySignals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      Watch for Emergency Signals
                    </h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <ul className="space-y-2">
                        {result.emergencySignals.map((signal, index) => (
                          <li key={index} className="flex items-start text-red-800">
                            <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {signal}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex space-x-3">
                        <Button variant="destructive" size="sm" data-testid="button-call-911">
                          <Phone className="w-4 h-4 mr-1" />
                          Call 911
                        </Button>
                        <Button variant="outline" size="sm" data-testid="button-urgent-care">
                          Find Urgent Care
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card data-testid="recommendations-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Personalized Recommendations</CardTitle>
          <p className="text-slate-600">Evidence-based care suggestions for your symptoms</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Medications */}
            {result.recommendations.medications && result.recommendations.medications.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <PillBottle className="w-5 h-5 mr-2 text-medical-blue" />
                  Medications
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.medications.map((med, index) => (
                    <li key={index} className="text-sm text-slate-700 p-2 bg-blue-50 rounded">
                      {med}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                  ⚠️ Consult a healthcare provider before taking any medications
                </p>
              </div>
            )}

            {/* Diet Recommendations */}
            {result.recommendations.diet && result.recommendations.diet.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-health-green" />
                  Dietary Advice
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.diet.map((diet, index) => (
                    <li key={index} className="text-sm text-slate-700 p-2 bg-green-50 rounded">
                      {diet}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lifestyle Changes */}
            {result.recommendations.lifestyle && result.recommendations.lifestyle.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-medical-purple" />
                  Lifestyle
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.lifestyle.map((lifestyle, index) => (
                    <li key={index} className="text-sm text-slate-700 p-2 bg-purple-50 rounded">
                      {lifestyle}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up Care */}
            {result.recommendations.followUp && result.recommendations.followUp.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-medical-amber" />
                  Follow-up Care
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.followUp.map((followUp, index) => (
                    <li key={index} className="text-sm text-slate-700 p-2 bg-amber-50 rounded">
                      {followUp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card data-testid="action-buttons-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-medical-blue hover:bg-medical-blue-dark" data-testid="button-save-results">
              <FileText className="w-4 h-4 mr-2" />
              Save Results
            </Button>
            
            <Button variant="outline" data-testid="button-share-with-doctor">
              <Phone className="w-4 h-4 mr-2" />
              Share with Doctor
            </Button>
            
            <Button variant="outline" data-testid="button-new-analysis">
              <Activity className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
            
            {result.riskLevel !== "LOW" && (
              <Button variant="outline" className="border-medical-amber text-medical-amber hover:bg-amber-50" data-testid="button-schedule-followup">
                <Clock className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <Alert data-testid="medical-disclaimer">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important Medical Disclaimer:</strong> This assessment is for informational purposes only and is not a substitute 
          for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers 
          with any questions about your medical condition.
        </AlertDescription>
      </Alert>
    </div>
  );
}
