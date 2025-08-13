import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MedicalResource } from "@shared/schema";
import { Heart, ArrowLeft, Search, Calculator, PillBottle, AlertTriangle, Stethoscope, BookOpen } from "lucide-react";
import { z } from "zod";

// Schema for health calculators
const bmiCalculatorSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  unit: z.enum(["metric", "imperial"]),
});

const calorieCalculatorSchema = z.object({
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["male", "female"]),
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
});

const drugInteractionSchema = z.object({
  drug1: z.string().min(1, "First medication is required"),
  drug2: z.string().min(1, "Second medication is required"),
});

type BMICalculator = z.infer<typeof bmiCalculatorSchema>;
type CalorieCalculator = z.infer<typeof calorieCalculatorSchema>;
type DrugInteraction = z.infer<typeof drugInteractionSchema>;

interface HealthMetric {
  type: string;
  value: number | string;
  status: "normal" | "warning" | "critical";
  recommendation: string;
}

interface DrugInfo {
  name: string;
  genericName: string;
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  interactions: string[];
}

interface DrugInteractionResult {
  drug1: string;
  drug2: string;
  severity: "minor" | "moderate" | "major";
  description: string;
  recommendation: string;
}

export default function MedicalResources() {
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [bmiResult, setBmiResult] = useState<HealthMetric | null>(null);
  const [calorieResult, setCalorieResult] = useState<HealthMetric | null>(null);
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
  const [interactionResult, setInteractionResult] = useState<DrugInteractionResult | null>(null);
  const { toast } = useToast();

  const bmiForm = useForm<BMICalculator>({
    resolver: zodResolver(bmiCalculatorSchema),
    defaultValues: {
      weight: "",
      height: "",
      unit: "metric",
    },
  });

  const calorieForm = useForm<CalorieCalculator>({
    resolver: zodResolver(calorieCalculatorSchema),
    defaultValues: {
      age: "",
      gender: "male",
      weight: "",
      height: "",
      activityLevel: "moderate",
    },
  });

  const drugForm = useForm<DrugInteraction>({
    resolver: zodResolver(drugInteractionSchema),
    defaultValues: {
      drug1: "",
      drug2: "",
    },
  });

  // Fetch medical resources
  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ["/api/medical-resources"],
  });

  // BMI Calculator
  const bmiMutation = useMutation({
    mutationFn: async (data: BMICalculator) => {
      const response = await apiRequest("POST", "/api/calculate-bmi", data);
      return response.json();
    },
    onSuccess: (data) => {
      setBmiResult(data);
      toast({
        title: "BMI Calculated",
        description: `Your BMI is ${data.value}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calorie Calculator
  const calorieMutation = useMutation({
    mutationFn: async (data: CalorieCalculator) => {
      const response = await apiRequest("POST", "/api/calculate-calories", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCalorieResult(data);
      toast({
        title: "Daily Calories Calculated",
        description: `You need approximately ${data.value} calories per day`,
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Drug Information Lookup
  const drugInfoMutation = useMutation({
    mutationFn: async (drugName: string) => {
      const response = await apiRequest("GET", `/api/drug-info/${drugName}`);
      return response.json();
    },
    onSuccess: (data) => {
      setDrugInfo(data);
      toast({
        title: "Drug Information Found",
        description: `Information for ${data.name} loaded`,
      });
    },
    onError: (error) => {
      toast({
        title: "Drug Information Not Found",
        description: error.message,
        variant: "destructive",
      });
      setDrugInfo(null);
    },
  });

  // Drug Interaction Checker
  const interactionMutation = useMutation({
    mutationFn: async (data: DrugInteraction) => {
      const response = await apiRequest("POST", "/api/drug-interactions", data);
      return response.json();
    },
    onSuccess: (data) => {
      setInteractionResult(data);
      if (data) {
        toast({
          title: "Drug Interaction Found",
          description: `${data.severity} interaction detected`,
          variant: data.severity === "major" ? "destructive" : "default",
        });
      } else {
        toast({
          title: "No Interactions Found",
          description: "These medications appear safe to use together",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Interaction Check Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onBMISubmit = (data: BMICalculator) => {
    bmiMutation.mutate(data);
  };

  const onCalorieSubmit = (data: CalorieCalculator) => {
    calorieMutation.mutate(data);
  };

  const onDrugInteractionSubmit = (data: DrugInteraction) => {
    interactionMutation.mutate(data);
  };

  const searchDrugInfo = (drugName: string) => {
    if (drugName.trim()) {
      drugInfoMutation.mutate(drugName.trim());
    }
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
                <span className="text-lg font-bold text-slate-800">Medical Resources</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Medical Resources & Tools</h1>
          <p className="text-slate-600">Reliable health information and professional medical calculators</p>
        </div>

        <Tabs defaultValue="calculators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculators" data-testid="tab-calculators">
              <Calculator className="w-4 h-4 mr-2" />
              Health Calculators
            </TabsTrigger>
            <TabsTrigger value="drugs" data-testid="tab-drugs">
              <PillBottle className="w-4 h-4 mr-2" />
              Drug Information
            </TabsTrigger>
            <TabsTrigger value="interactions" data-testid="tab-interactions">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Drug Interactions
            </TabsTrigger>
            <TabsTrigger value="articles" data-testid="tab-articles">
              <BookOpen className="w-4 h-4 mr-2" />
              Health Articles
            </TabsTrigger>
          </TabsList>

          {/* Health Calculators */}
          <TabsContent value="calculators">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BMI Calculator */}
              <Card data-testid="bmi-calculator">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-medical-blue" />
                    BMI Calculator
                  </CardTitle>
                  <p className="text-slate-600">Calculate your Body Mass Index</p>
                </CardHeader>
                <CardContent>
                  <Form {...bmiForm}>
                    <form onSubmit={bmiForm.handleSubmit(onBMISubmit)} className="space-y-4">
                      <FormField
                        control={bmiForm.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit System</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-bmi-unit">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="metric">Metric (kg/m)</SelectItem>
                                <SelectItem value="imperial">Imperial (lb/in)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={bmiForm.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Weight ({bmiForm.watch("unit") === "metric" ? "kg" : "lbs"})
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="number"
                                  placeholder="70"
                                  data-testid="input-bmi-weight"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={bmiForm.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Height ({bmiForm.watch("unit") === "metric" ? "m" : "in"})
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  placeholder={bmiForm.watch("unit") === "metric" ? "1.75" : "69"}
                                  data-testid="input-bmi-height"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-medical-blue hover:bg-medical-blue-dark"
                        disabled={bmiMutation.isPending}
                        data-testid="button-calculate-bmi"
                      >
                        {bmiMutation.isPending ? "Calculating..." : "Calculate BMI"}
                      </Button>
                    </form>
                  </Form>

                  {bmiResult && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg" data-testid="bmi-result">
                      <div className="text-center mb-4">
                        <div className={`text-3xl font-bold ${
                          bmiResult.status === "normal" ? "text-health-green" :
                          bmiResult.status === "warning" ? "text-medical-amber" : "text-red-600"
                        }`}>
                          {bmiResult.value}
                        </div>
                        <Badge variant={bmiResult.status === "normal" ? "default" : "destructive"}>
                          {bmiResult.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 text-center">
                        {bmiResult.recommendation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calorie Calculator */}
              <Card data-testid="calorie-calculator">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-health-green" />
                    Daily Calorie Calculator
                  </CardTitle>
                  <p className="text-slate-600">Calculate daily caloric needs</p>
                </CardHeader>
                <CardContent>
                  <Form {...calorieForm}>
                    <form onSubmit={calorieForm.handleSubmit(onCalorieSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={calorieForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age (years)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="number"
                                  placeholder="30"
                                  data-testid="input-calorie-age"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={calorieForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-calorie-gender">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={calorieForm.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="number"
                                  placeholder="70"
                                  data-testid="input-calorie-weight"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={calorieForm.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="number"
                                  placeholder="175"
                                  data-testid="input-calorie-height"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={calorieForm.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-calorie-activity">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                                <SelectItem value="light">Lightly active (1-3 days/week)</SelectItem>
                                <SelectItem value="moderate">Moderately active (3-5 days/week)</SelectItem>
                                <SelectItem value="active">Very active (6-7 days/week)</SelectItem>
                                <SelectItem value="very_active">Super active (2x/day, intense)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-health-green hover:bg-health-green-dark"
                        disabled={calorieMutation.isPending}
                        data-testid="button-calculate-calories"
                      >
                        {calorieMutation.isPending ? "Calculating..." : "Calculate Daily Calories"}
                      </Button>
                    </form>
                  </Form>

                  {calorieResult && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg" data-testid="calorie-result">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-health-green">
                          {calorieResult.value} calories/day
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 text-center">
                        {calorieResult.recommendation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Drug Information */}
          <TabsContent value="drugs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Drug Search */}
              <Card data-testid="drug-search">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PillBottle className="w-5 h-5 mr-2 text-medical-blue" />
                    Drug Information Lookup
                  </CardTitle>
                  <p className="text-slate-600">Search for medication details and information</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter medication name..."
                        value={selectedDrug}
                        onChange={(e) => setSelectedDrug(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchDrugInfo(selectedDrug)}
                        data-testid="input-drug-search"
                      />
                      <Button 
                        onClick={() => searchDrugInfo(selectedDrug)}
                        disabled={drugInfoMutation.isPending}
                        data-testid="button-search-drug"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        Always consult your healthcare provider before starting or stopping any medication.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              {/* Drug Information Display */}
              {drugInfo && (
                <Card data-testid="drug-info-display">
                  <CardHeader>
                    <CardTitle>{drugInfo.name}</CardTitle>
                    {drugInfo.genericName && (
                      <p className="text-slate-600">Generic: {drugInfo.genericName}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Dosage</h4>
                      <p className="text-sm text-slate-600">{drugInfo.dosage}</p>
                    </div>
                    
                    {drugInfo.sideEffects.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Common Side Effects</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {drugInfo.sideEffects.slice(0, 5).map((effect, index) => (
                            <li key={index}>• {effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {drugInfo.contraindications.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Contraindications</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {drugInfo.contraindications.slice(0, 3).map((contra, index) => (
                            <li key={index}>• {contra}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Drug Interactions */}
          <TabsContent value="interactions">
            <Card data-testid="drug-interactions">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-medical-amber" />
                  Drug Interaction Checker
                </CardTitle>
                <p className="text-slate-600">Check for interactions between medications</p>
              </CardHeader>
              <CardContent>
                <Form {...drugForm}>
                  <form onSubmit={drugForm.handleSubmit(onDrugInteractionSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={drugForm.control}
                        name="drug1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Medication</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="e.g., Warfarin"
                                data-testid="input-drug1"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={drugForm.control}
                        name="drug2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Second Medication</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="e.g., Aspirin"
                                data-testid="input-drug2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-medical-amber hover:bg-yellow-600"
                      disabled={interactionMutation.isPending}
                      data-testid="button-check-interactions"
                    >
                      {interactionMutation.isPending ? "Checking..." : "Check Interactions"}
                    </Button>
                  </form>
                </Form>

                {interactionResult && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg" data-testid="interaction-result">
                    <div className={`border-l-4 pl-4 ${
                      interactionResult.severity === "major" ? "border-red-500" :
                      interactionResult.severity === "moderate" ? "border-yellow-500" : "border-green-500"
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={
                          interactionResult.severity === "major" ? "destructive" :
                          interactionResult.severity === "moderate" ? "secondary" : "default"
                        }>
                          {interactionResult.severity.toUpperCase()} INTERACTION
                        </Badge>
                      </div>
                      <p className="font-medium text-slate-800 mb-2">
                        {interactionResult.drug1} + {interactionResult.drug2}
                      </p>
                      <p className="text-sm text-slate-600 mb-2">
                        {interactionResult.description}
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        Recommendation: {interactionResult.recommendation}
                      </p>
                    </div>
                  </div>
                )}

                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    This tool provides general information only. Always consult your pharmacist or doctor 
                    before combining medications.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Articles */}
          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading health articles...</p>
                </div>
              ) : resources && Array.isArray(resources) && resources.length > 0 ? (
                resources.map((resource: MedicalResource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow" data-testid={`article-${resource.id}`}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Stethoscope className="w-5 h-5 mr-2 text-medical-blue" />
                        {resource.title}
                      </CardTitle>
                      <Badge variant="outline">{resource.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {resource.content.substring(0, 150)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(resource.tags as string[]).slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No Articles Available</h3>
                  <p className="text-slate-600">Check back later for health articles and resources.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
