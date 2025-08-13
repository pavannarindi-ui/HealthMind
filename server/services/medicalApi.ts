// Medical API integration service for external medical data
// This service handles integration with various medical APIs for drug information, 
// medical conditions, and health data

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: "minor" | "moderate" | "major";
  description: string;
  recommendation: string;
}

export interface DrugInfo {
  name: string;
  genericName: string;
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  interactions: string[];
}

export interface HealthMetric {
  type: "bmi" | "calories" | "heartRate" | "bloodPressure";
  value: number | string;
  status: "normal" | "warning" | "critical";
  recommendation: string;
}

class MedicalApiService {
  private fdaApiKey: string;
  private baseUrl: string;

  constructor() {
    // Use FDA OpenFDA API (free tier available)
    this.fdaApiKey = process.env.FDA_API_KEY || process.env.MEDICAL_API_KEY || "";
    this.baseUrl = "https://api.fda.gov";
  }

  async searchDrugInfo(drugName: string): Promise<DrugInfo | null> {
    try {
      // FDA OpenFDA API for drug information
      const response = await fetch(
        `${this.baseUrl}/drug/label.json?search=openfda.brand_name:"${drugName}"&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(`FDA API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const drug = data.results[0];
        return {
          name: drug.openfda?.brand_name?.[0] || drugName,
          genericName: drug.openfda?.generic_name?.[0] || "",
          dosage: drug.dosage_and_administration?.[0] || "Consult prescribing information",
          sideEffects: drug.adverse_reactions || [],
          contraindications: drug.contraindications || [],
          interactions: drug.drug_interactions || [],
        };
      }

      return null;
    } catch (error) {
      console.error("Drug info search error:", error);
      // Return fallback data structure
      return {
        name: drugName,
        genericName: "Information not available",
        dosage: "Consult healthcare provider for proper dosage",
        sideEffects: ["Consult prescribing information"],
        contraindications: ["Consult healthcare provider"],
        interactions: ["Always inform your doctor of all medications"],
      };
    }
  }

  async checkDrugInteractions(drug1: string, drug2: string): Promise<DrugInteraction | null> {
    try {
      // This would typically use a drug interaction API
      // For now, provide structured response format
      
      // Simulate API call with common interaction patterns
      const commonInteractions = [
        {
          drugs: ["warfarin", "aspirin"],
          severity: "major" as const,
          description: "Increased risk of bleeding",
          recommendation: "Monitor closely and consider alternative therapy",
        },
        {
          drugs: ["acetaminophen", "alcohol"],
          severity: "moderate" as const,
          description: "Increased risk of liver damage",
          recommendation: "Avoid alcohol while taking acetaminophen",
        },
      ];

      const interaction = commonInteractions.find(item =>
        (item.drugs.includes(drug1.toLowerCase()) && item.drugs.includes(drug2.toLowerCase()))
      );

      if (interaction) {
        return {
          drug1,
          drug2,
          severity: interaction.severity,
          description: interaction.description,
          recommendation: interaction.recommendation,
        };
      }

      return null;
    } catch (error) {
      console.error("Drug interaction check error:", error);
      return null;
    }
  }

  calculateBMI(weight: number, height: number, unit: "metric" | "imperial" = "metric"): HealthMetric {
    try {
      let bmi: number;
      
      if (unit === "imperial") {
        // weight in pounds, height in inches
        bmi = (weight / (height * height)) * 703;
      } else {
        // weight in kg, height in meters
        bmi = weight / (height * height);
      }

      bmi = Math.round(bmi * 10) / 10;

      let status: "normal" | "warning" | "critical";
      let recommendation: string;

      if (bmi < 18.5) {
        status = "warning";
        recommendation = "Consider consulting a healthcare provider about healthy weight gain strategies.";
      } else if (bmi >= 18.5 && bmi < 25) {
        status = "normal";
        recommendation = "Maintain your current weight through balanced diet and regular exercise.";
      } else if (bmi >= 25 && bmi < 30) {
        status = "warning";
        recommendation = "Consider lifestyle changes to achieve a healthier weight range.";
      } else {
        status = "critical";
        recommendation = "Consult a healthcare provider for a comprehensive weight management plan.";
      }

      return {
        type: "bmi",
        value: bmi,
        status,
        recommendation,
      };
    } catch (error) {
      console.error("BMI calculation error:", error);
      return {
        type: "bmi",
        value: 0,
        status: "warning",
        recommendation: "Unable to calculate BMI. Please check your input values.",
      };
    }
  }

  calculateDailyCalories(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  ): HealthMetric {
    try {
      // Harris-Benedict Equation
      let bmr: number;
      
      if (gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }

      // Activity multipliers
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };

      const dailyCalories = Math.round(bmr * activityMultipliers[activityLevel]);

      return {
        type: "calories",
        value: dailyCalories,
        status: "normal",
        recommendation: `Based on your profile, aim for approximately ${dailyCalories} calories per day to maintain your current weight.`,
      };
    } catch (error) {
      console.error("Calorie calculation error:", error);
      return {
        type: "calories",
        value: 2000,
        status: "warning",
        recommendation: "Unable to calculate precise caloric needs. Consider consulting a nutritionist.",
      };
    }
  }

  async getEmergencyInfo(condition: string): Promise<{
    title: string;
    steps: string[];
    whenToCall911: string[];
    disclaimer: string;
  }> {
    // Emergency medical information - this would typically come from medical databases
    const emergencyProcedures: Record<string, any> = {
      "heart_attack": {
        title: "Heart Attack Response",
        steps: [
          "Call 911 immediately",
          "Have person sit down and rest",
          "Loosen any tight clothing",
          "If prescribed, help them take nitroglycerin",
          "If available and person is not allergic, give aspirin",
          "Be prepared to perform CPR if person becomes unconscious"
        ],
        whenToCall911: [
          "Chest pain or discomfort",
          "Pain spreading to arms, neck, jaw, or back",
          "Shortness of breath",
          "Nausea or vomiting",
          "Cold sweats",
          "Lightheadedness"
        ],
        disclaimer: "This is emergency guidance only. Always call 911 for suspected heart attacks."
      },
      "choking": {
        title: "Choking Response",
        steps: [
          "Ask 'Are you choking?' If they can speak, encourage coughing",
          "If they cannot speak, stand behind them",
          "Place arms around their waist",
          "Make a fist with one hand, place thumb side against upper abdomen",
          "Grasp fist with other hand and thrust upward quickly",
          "Repeat until object is expelled or person becomes unconscious",
          "If unconscious, call 911 and begin CPR"
        ],
        whenToCall911: [
          "Person cannot breathe or speak",
          "Person becomes unconscious",
          "Object cannot be removed",
          "Person continues to have difficulty breathing after object removal"
        ],
        disclaimer: "This is emergency guidance only. Call 911 if choking cannot be resolved quickly."
      }
    };

    const procedure = emergencyProcedures[condition.toLowerCase()];
    
    if (procedure) {
      return procedure;
    }

    // Default emergency response
    return {
      title: "Emergency Response",
      steps: [
        "Ensure scene safety",
        "Check person's responsiveness",
        "Call 911 if person is unresponsive or in distress",
        "Provide basic comfort and reassurance",
        "Do not move person unless in immediate danger",
        "Monitor breathing and pulse if trained"
      ],
      whenToCall911: [
        "Person is unconscious or unresponsive",
        "Severe bleeding that won't stop",
        "Signs of stroke (facial drooping, arm weakness, speech difficulty)",
        "Severe difficulty breathing",
        "Chest pain",
        "Signs of severe allergic reaction"
      ],
      disclaimer: "When in doubt, always call 911. This information is not a substitute for professional emergency medical training."
    };
  }
}

export const medicalApiService = new MedicalApiService();
