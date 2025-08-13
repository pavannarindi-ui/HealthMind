import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { symptomAnalysisSchema, type SymptomAnalysis } from "@shared/schema";
import BodyDiagram from "@/components/BodyDiagram";
import RiskAssessment from "@/components/RiskAssessment";
import { Heart, ArrowLeft, Search } from "lucide-react";

interface SymptomAnalysisResult {
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

export default function SymptomChecker() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResult | null>(null);
  const [painLevel, setPainLevel] = useState([5]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SymptomAnalysis>({
    resolver: zodResolver(symptomAnalysisSchema),
    defaultValues: {
      bodyPart: "",
      symptoms: "",
      painLevel: 5,
      duration: "",
      additionalInfo: "",
    },
  });

  const analyzeSymptoms = useMutation({
    mutationFn: async (data: SymptomAnalysis) => {
      const response = await apiRequest("POST", "/api/analyze-symptoms", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Symptom Analysis Complete",
        description: "Your symptoms have been analyzed. Please review the recommendations below.",
      });
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById("analysis-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SymptomAnalysis) => {
    const formData = {
      ...data,
      bodyPart: selectedBodyPart || data.bodyPart,
      painLevel: painLevel[0],
    };
    analyzeSymptoms.mutate(formData);
  };

  const handleBodyPartSelect = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart);
    form.setValue("bodyPart", bodyPart);
  };

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
                <span className="text-lg font-bold text-slate-800">Symptom Checker</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8" data-testid="symptom-checker-main">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
              <Search className="w-6 h-6 mr-2 text-medical-blue" />
              Interactive Symptom Checker
            </CardTitle>
            <p className="text-slate-600">Select the affected area on the body diagram and describe your symptoms</p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Body Diagram */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Affected Area</h3>
                <BodyDiagram 
                  onBodyPartSelect={handleBodyPartSelect} 
                  selectedBodyPart={selectedBodyPart}
                />
                <div className="mt-4 text-sm text-slate-600">
                  <p>Click on body areas to select symptoms location</p>
                  {selectedBodyPart && (
                    <p className="mt-2 text-medical-blue font-medium">
                      Selected: {selectedBodyPart.charAt(0).toUpperCase() + selectedBodyPart.slice(1)}
                    </p>
                  )}
                </div>
              </div>

              {/* Symptom Details Form */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Describe Your Symptoms</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bodyPart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selected Area</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Click on body diagram or type here"
                              value={selectedBodyPart || field.value}
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedBodyPart(e.target.value);
                              }}
                              data-testid="input-body-part"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="symptoms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Symptom Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Describe your symptoms in detail..."
                              className="h-24"
                              data-testid="textarea-symptoms"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Pain Level (1-10)</FormLabel>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Slider
                            value={painLevel}
                            onValueChange={setPainLevel}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                            data-testid="slider-pain-level"
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600 w-8">
                          {painLevel[0]}/10
                        </span>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-duration">
                                <SelectValue placeholder="How long have you had these symptoms?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="less-than-hour">Less than 1 hour</SelectItem>
                              <SelectItem value="1-6-hours">1-6 hours</SelectItem>
                              <SelectItem value="6-24-hours">6-24 hours</SelectItem>
                              <SelectItem value="1-3-days">1-3 days</SelectItem>
                              <SelectItem value="more-than-3-days">More than 3 days</SelectItem>
                              <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                              <SelectItem value="more-than-2-weeks">More than 2 weeks</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Any other relevant information..."
                              className="h-20"
                              data-testid="textarea-additional-info"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-medical-blue hover:bg-medical-blue-dark"
                      disabled={analyzeSymptoms.isPending}
                      data-testid="button-analyze-symptoms"
                    >
                      {analyzeSymptoms.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Analyze Symptoms
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <div id="analysis-results">
            <RiskAssessment result={analysisResult} />
          </div>
        )}
      </main>
    </div>
  );
}
