import Groq from "groq-sdk";

// Using Groq with the user's API key for fast AI inference
const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY, // Using the same env var name for compatibility
});

export interface MedicalChatResponse {
  response: string;
  confidence: number;
  requiresUrgentCare: boolean;
  recommendations?: string[];
}

export interface SymptomAnalysisResult {
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
}

export async function analyzeMedicalChat(message: string, context?: string): Promise<MedicalChatResponse> {
  try {
    const systemPrompt = `You are a medical AI assistant. Provide helpful, accurate medical information while always emphasizing the importance of professional medical consultation. 
    
    Guidelines:
    - Provide informative responses about symptoms, conditions, and general health
    - Always include appropriate medical disclaimers
    - Identify potential emergency situations and advise immediate medical attention
    - Suggest when to consult healthcare professionals
    - Do not provide specific diagnoses or prescribe medications
    - Be empathetic and supportive
    
    Respond with JSON in this format: {
      "response": "your detailed response",
      "confidence": 0.85,
      "requiresUrgentCare": false,
      "recommendations": ["recommendation1", "recommendation2"]
    }`;

    const userMessage = context ? `Context: ${context}\n\nQuestion: ${message}` : message;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      response: result.response || "I'm sorry, I couldn't process your request. Please consult a healthcare professional.",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      requiresUrgentCare: result.requiresUrgentCare || false,
      recommendations: result.recommendations || [],
    };
  } catch (error) {
    console.error("Groq medical chat error:", error);
    throw new Error("Failed to process medical chat: " + (error as Error).message);
  }
}

export async function analyzeSymptoms(
  bodyPart: string,
  symptoms: string,
  painLevel: number,
  duration: string,
  additionalInfo?: string
): Promise<SymptomAnalysisResult> {
  try {
    const systemPrompt = `You are a medical symptom analysis AI. Analyze the provided symptoms and provide a structured assessment.
    
    Important guidelines:
    - Never provide definitive diagnoses - only suggest possibilities
    - Always recommend professional medical evaluation for concerning symptoms
    - Consider pain level (1-10) and duration in your assessment
    - Provide appropriate risk level based on symptom severity
    - Include clear emergency signals that require immediate attention
    
    Risk Levels:
    - LOW: Minor symptoms, self-care possible
    - MEDIUM: Should see doctor within few days
    - HIGH: Should see doctor within 24 hours
    - CRITICAL: Seek immediate emergency care
    
    Respond with JSON in this format: {
      "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
      "diagnosis": "possible conditions description",
      "confidence": 0.75,
      "recommendations": {
        "medications": ["suggestion1"],
        "diet": ["suggestion1"],
        "lifestyle": ["suggestion1"],
        "followUp": ["suggestion1"]
      },
      "urgentCare": false,
      "emergencySignals": ["signal1", "signal2"]
    }`;

    const userInput = `
    Body Part: ${bodyPart}
    Symptoms: ${symptoms}
    Pain Level: ${painLevel}/10
    Duration: ${duration}
    Additional Info: ${additionalInfo || "None"}
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent medical analysis
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      riskLevel: result.riskLevel || "MEDIUM",
      diagnosis: result.diagnosis || "Unable to determine possible conditions. Please consult a healthcare professional.",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      recommendations: {
        medications: result.recommendations?.medications || [],
        diet: result.recommendations?.diet || [],
        lifestyle: result.recommendations?.lifestyle || [],
        followUp: result.recommendations?.followUp || ["Consult with a healthcare professional"],
      },
      urgentCare: result.urgentCare || false,
      emergencySignals: result.emergencySignals || [],
    };
  } catch (error) {
    console.error("Groq symptom analysis error:", error);
    throw new Error("Failed to analyze symptoms: " + (error as Error).message);
  }
}

export async function generateFollowUpPlan(
  diagnosis: string,
  riskLevel: string,
  currentSymptoms: string
): Promise<{
  title: string;
  description: string;
  totalDays: number;
  checkInFrequency: string;
  milestones: string[];
}> {
  try {
    const systemPrompt = `You are a medical follow-up planning AI. Create a structured follow-up care plan based on the provided medical information.
    
    Guidelines:
    - Create realistic recovery timelines
    - Include specific milestones to track progress
    - Consider the risk level in planning frequency
    - Provide actionable follow-up steps
    
    Respond with JSON in this format: {
      "title": "descriptive title",
      "description": "detailed description",
      "totalDays": 7,
      "checkInFrequency": "daily|every 2 days|weekly",
      "milestones": ["milestone1", "milestone2"]
    }`;

    const userInput = `
    Diagnosis: ${diagnosis}
    Risk Level: ${riskLevel}
    Current Symptoms: ${currentSymptoms}
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      title: result.title || "Recovery Monitoring",
      description: result.description || "Monitor symptoms and recovery progress",
      totalDays: result.totalDays || 7,
      checkInFrequency: result.checkInFrequency || "daily",
      milestones: result.milestones || ["Symptom improvement", "Full recovery"],
    };
  } catch (error) {
    console.error("Groq follow-up planning error:", error);
    throw new Error("Failed to generate follow-up plan: " + (error as Error).message);
  }
}
