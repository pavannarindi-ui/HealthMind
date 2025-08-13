import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  symptomAnalysisSchema, 
  chatRequestSchema, 
  doctorLoginSchema,
  insertFollowUpSchema 
} from "@shared/schema";
import { analyzeMedicalChat, analyzeSymptoms, generateFollowUpPlan } from "./services/openai";
import { medicalApiService } from "./services/medicalApi";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get sample user for demo
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser("user-1");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Medical chat endpoint
  app.post("/api/medical-chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      const userId = "user-1"; // In real app, get from session

      const chatResponse = await analyzeMedicalChat(
        validatedData.message,
        validatedData.context
      );

      // Save chat message
      await storage.createChatMessage({
        userId,
        message: validatedData.message,
        response: chatResponse.response,
        isVoice: validatedData.isVoice,
      });

      res.json(chatResponse);
    } catch (error) {
      console.error("Medical chat error:", error);
      res.status(500).json({ 
        message: "Failed to process medical chat",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get chat history
  app.get("/api/chat-history/:userId", async (req, res) => {
    try {
      const messages = await storage.getChatMessagesByUser(req.params.userId);
      res.json(messages);
    } catch (error) {
      console.error("Get chat history error:", error);
      res.status(500).json({ message: "Failed to get chat history" });
    }
  });

  // Symptom analysis endpoint
  app.post("/api/analyze-symptoms", async (req, res) => {
    try {
      const validatedData = symptomAnalysisSchema.parse(req.body);
      const userId = "user-1";

      const analysis = await analyzeSymptoms(
        validatedData.bodyPart,
        validatedData.symptoms,
        validatedData.painLevel,
        validatedData.duration,
        validatedData.additionalInfo
      );

      // Create medical record
      const medicalRecord = await storage.createMedicalRecord({
        userId,
        symptoms: {
          bodyPart: validatedData.bodyPart,
          description: validatedData.symptoms,
          painLevel: validatedData.painLevel,
          duration: validatedData.duration,
        },
        riskLevel: analysis.riskLevel,
        diagnosis: analysis.diagnosis,
        recommendations: analysis.recommendations,
      });

      // Generate follow-up plan if needed
      if (analysis.riskLevel !== "LOW") {
        const followUpPlan = await generateFollowUpPlan(
          analysis.diagnosis,
          analysis.riskLevel,
          validatedData.symptoms
        );

        await storage.createFollowUp({
          userId,
          recordId: medicalRecord.id,
          title: followUpPlan.title,
          description: followUpPlan.description,
          status: "active",
          progress: 0,
          nextCheckIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          totalDays: followUpPlan.totalDays,
          currentDay: 1,
        });
      }

      res.json({ ...analysis, recordId: medicalRecord.id });
    } catch (error) {
      console.error("Symptom analysis error:", error);
      res.status(500).json({ 
        message: "Failed to analyze symptoms",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Follow-up care endpoints
  app.get("/api/follow-ups/:userId", async (req, res) => {
    try {
      const followUps = await storage.getFollowUpsByUser(req.params.userId);
      res.json(followUps);
    } catch (error) {
      console.error("Get follow-ups error:", error);
      res.status(500).json({ message: "Failed to get follow-ups" });
    }
  });

  app.put("/api/follow-ups/:id", async (req, res) => {
    try {
      const updates = req.body;
      const updatedFollowUp = await storage.updateFollowUp(req.params.id, updates);
      res.json(updatedFollowUp);
    } catch (error) {
      console.error("Update follow-up error:", error);
      res.status(500).json({ message: "Failed to update follow-up" });
    }
  });

  // Doctor portal endpoints
  app.post("/api/doctor-login", async (req, res) => {
    try {
      const validatedData = doctorLoginSchema.parse(req.body);
      
      // In real app, verify license and PIN against medical database
      const doctor = await storage.getDoctorByLicense(validatedData.licenseNumber);
      
      if (!doctor) {
        return res.status(401).json({ message: "Invalid license number or PIN" });
      }

      // In real app, verify PIN hash
      // For demo, accept any 4+ digit PIN
      if (validatedData.pin.length < 4) {
        return res.status(401).json({ message: "Invalid license number or PIN" });
      }

      res.json({ 
        success: true, 
        doctor: {
          id: doctor.id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          specialty: doctor.specialty,
          isVerified: doctor.isVerified,
        }
      });
    } catch (error) {
      console.error("Doctor login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Medical resources endpoints
  app.get("/api/medical-resources", async (req, res) => {
    try {
      const category = req.query.category as string;
      let resources;
      
      if (category) {
        resources = await storage.getMedicalResourcesByCategory(category);
      } else {
        resources = await storage.getMedicalResources();
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Get medical resources error:", error);
      res.status(500).json({ message: "Failed to get medical resources" });
    }
  });

  // Drug information endpoints
  app.get("/api/drug-info/:drugName", async (req, res) => {
    try {
      const drugInfo = await medicalApiService.searchDrugInfo(req.params.drugName);
      
      if (!drugInfo) {
        return res.status(404).json({ message: "Drug information not found" });
      }
      
      res.json(drugInfo);
    } catch (error) {
      console.error("Drug info error:", error);
      res.status(500).json({ message: "Failed to get drug information" });
    }
  });

  app.post("/api/drug-interactions", async (req, res) => {
    try {
      const { drug1, drug2 } = req.body;
      
      if (!drug1 || !drug2) {
        return res.status(400).json({ message: "Both drug names are required" });
      }
      
      const interaction = await medicalApiService.checkDrugInteractions(drug1, drug2);
      res.json(interaction);
    } catch (error) {
      console.error("Drug interaction check error:", error);
      res.status(500).json({ message: "Failed to check drug interactions" });
    }
  });

  // Health calculator endpoints
  app.post("/api/calculate-bmi", async (req, res) => {
    try {
      const { weight, height, unit } = req.body;
      
      if (!weight || !height) {
        return res.status(400).json({ message: "Weight and height are required" });
      }
      
      const bmi = medicalApiService.calculateBMI(
        parseFloat(weight), 
        parseFloat(height), 
        unit || "metric"
      );
      
      res.json(bmi);
    } catch (error) {
      console.error("BMI calculation error:", error);
      res.status(500).json({ message: "Failed to calculate BMI" });
    }
  });

  app.post("/api/calculate-calories", async (req, res) => {
    try {
      const { age, gender, weight, height, activityLevel } = req.body;
      
      if (!age || !gender || !weight || !height || !activityLevel) {
        return res.status(400).json({ message: "All parameters are required" });
      }
      
      const calories = medicalApiService.calculateDailyCalories(
        parseInt(age),
        gender,
        parseFloat(weight),
        parseFloat(height),
        activityLevel
      );
      
      res.json(calories);
    } catch (error) {
      console.error("Calorie calculation error:", error);
      res.status(500).json({ message: "Failed to calculate calories" });
    }
  });

  // Emergency information endpoint
  app.get("/api/emergency-info/:condition", async (req, res) => {
    try {
      const emergencyInfo = await medicalApiService.getEmergencyInfo(req.params.condition);
      res.json(emergencyInfo);
    } catch (error) {
      console.error("Emergency info error:", error);
      res.status(500).json({ message: "Failed to get emergency information" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
