import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for patient data
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  healthScore: integer("health_score").default(85),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical records for symptom tracking
export const medicalRecords = pgTable("medical_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  symptoms: jsonb("symptoms").notNull(), // Array of symptoms with body locations
  riskLevel: varchar("risk_level"), // LOW, MEDIUM, HIGH, CRITICAL
  diagnosis: text("diagnosis"),
  recommendations: jsonb("recommendations").notNull(), // Personalized recommendations
  createdAt: timestamp("created_at").defaultNow(),
});

// Follow-up care tracking
export const followUps = pgTable("follow_ups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  recordId: varchar("record_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  status: varchar("status").default("active"), // active, completed, cancelled
  progress: integer("progress").default(0), // 0-100
  nextCheckIn: timestamp("next_check_in"),
  totalDays: integer("total_days").default(7),
  currentDay: integer("current_day").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages with AI assistant
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  isVoice: boolean("is_voice").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Doctor credentials for professional portal
export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  licenseNumber: varchar("license_number").notNull().unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  specialty: varchar("specialty"),
  email: varchar("email").unique(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Offline medical resources
export const medicalResources = pgTable("medical_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  category: varchar("category").notNull(), // emergency, drugs, first-aid, articles
  content: text("content").notNull(),
  tags: jsonb("tags").notNull(), // Array of search tags
  priority: integer("priority").default(1), // For offline caching priority
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
});

export const insertFollowUpSchema = createInsertSchema(followUps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalResourceSchema = createInsertSchema(medicalResources).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type FollowUp = typeof followUps.$inferSelect;
export type InsertFollowUp = z.infer<typeof insertFollowUpSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type MedicalResource = typeof medicalResources.$inferSelect;
export type InsertMedicalResource = z.infer<typeof insertMedicalResourceSchema>;

// Symptom analysis request schema
export const symptomAnalysisSchema = z.object({
  bodyPart: z.string().min(1, "Body part is required"),
  symptoms: z.string().min(1, "Symptom description is required"),
  painLevel: z.number().min(1).max(10),
  duration: z.string().min(1, "Duration is required"),
  additionalInfo: z.string().optional(),
});

export type SymptomAnalysis = z.infer<typeof symptomAnalysisSchema>;

// Chat request schema
export const chatRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  isVoice: z.boolean().default(false),
  context: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Doctor login schema
export const doctorLoginSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  pin: z.string().min(4, "PIN must be at least 4 characters"),
});

export type DoctorLogin = z.infer<typeof doctorLoginSchema>;
