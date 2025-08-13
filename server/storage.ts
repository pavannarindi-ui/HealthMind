import {
  users,
  medicalRecords,
  followUps,
  chatMessages,
  doctors,
  medicalResources,
  type User,
  type InsertUser,
  type MedicalRecord,
  type InsertMedicalRecord,
  type FollowUp,
  type InsertFollowUp,
  type ChatMessage,
  type InsertChatMessage,
  type Doctor,
  type InsertDoctor,
  type MedicalResource,
  type InsertMedicalResource,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;

  // Medical records
  getMedicalRecord(id: string): Promise<MedicalRecord | undefined>;
  getMedicalRecordsByUser(userId: string): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;

  // Follow-up care
  getFollowUp(id: string): Promise<FollowUp | undefined>;
  getFollowUpsByUser(userId: string): Promise<FollowUp[]>;
  createFollowUp(followUp: InsertFollowUp): Promise<FollowUp>;
  updateFollowUp(id: string, followUp: Partial<InsertFollowUp>): Promise<FollowUp>;

  // Chat messages
  getChatMessagesByUser(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Doctor operations
  getDoctor(id: string): Promise<Doctor | undefined>;
  getDoctorByLicense(licenseNumber: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Medical resources
  getMedicalResources(): Promise<MedicalResource[]>;
  getMedicalResourcesByCategory(category: string): Promise<MedicalResource[]>;
  createMedicalResource(resource: InsertMedicalResource): Promise<MedicalResource>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private medicalRecords: Map<string, MedicalRecord>;
  private followUps: Map<string, FollowUp>;
  private chatMessages: Map<string, ChatMessage>;
  private doctors: Map<string, Doctor>;
  private medicalResources: Map<string, MedicalResource>;

  constructor() {
    this.users = new Map();
    this.medicalRecords = new Map();
    this.followUps = new Map();
    this.chatMessages = new Map();
    this.doctors = new Map();
    this.medicalResources = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: "user-1",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      profileImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      healthScore: 85,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Create sample medical resources
    const emergencyResources: MedicalResource[] = [
      {
        id: "resource-1",
        title: "CPR Instructions",
        category: "emergency",
        content: "1. Check responsiveness 2. Call 911 3. Check pulse 4. Start chest compressions...",
        tags: ["cpr", "emergency", "cardiac", "rescue"],
        priority: 1,
        lastUpdated: new Date(),
      },
      {
        id: "resource-2",
        title: "Choking Response",
        category: "emergency",
        content: "For conscious choking: 1. Stand behind person 2. Heimlich maneuver...",
        tags: ["choking", "emergency", "heimlich", "airway"],
        priority: 1,
        lastUpdated: new Date(),
      },
      {
        id: "resource-3",
        title: "Common Pain Medications",
        category: "drugs",
        content: "Ibuprofen: Anti-inflammatory, 400-800mg every 6-8 hours. Acetaminophen: Pain relief, 650-1000mg every 4-6 hours...",
        tags: ["medication", "pain", "ibuprofen", "acetaminophen"],
        priority: 2,
        lastUpdated: new Date(),
      },
    ];

    emergencyResources.forEach(resource => {
      this.medicalResources.set(resource.id, resource);
    });

    // Create sample follow-up
    const sampleFollowUp: FollowUp = {
      id: "followup-1",
      userId: "user-1",
      recordId: "record-1",
      title: "Headache Recovery",
      description: "Monitor headache symptoms and medication effectiveness",
      status: "active",
      progress: 43,
      nextCheckIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      totalDays: 7,
      currentDay: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.followUps.set(sampleFollowUp.id, sampleFollowUp);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      healthScore: userData.healthScore || 85,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...existingUser,
      ...userData,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Medical records
  async getMedicalRecord(id: string): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async getMedicalRecordsByUser(userId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(record => record.userId === userId);
  }

  async createMedicalRecord(recordData: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = randomUUID();
    const record: MedicalRecord = {
      id,
      userId: recordData.userId,
      symptoms: recordData.symptoms,
      riskLevel: recordData.riskLevel || null,
      diagnosis: recordData.diagnosis || null,
      recommendations: recordData.recommendations,
      createdAt: new Date(),
    };
    this.medicalRecords.set(id, record);
    return record;
  }

  // Follow-up care
  async getFollowUp(id: string): Promise<FollowUp | undefined> {
    return this.followUps.get(id);
  }

  async getFollowUpsByUser(userId: string): Promise<FollowUp[]> {
    return Array.from(this.followUps.values()).filter(followUp => followUp.userId === userId);
  }

  async createFollowUp(followUpData: InsertFollowUp): Promise<FollowUp> {
    const id = randomUUID();
    const followUp: FollowUp = {
      id,
      userId: followUpData.userId,
      recordId: followUpData.recordId,
      title: followUpData.title,
      description: followUpData.description || null,
      status: followUpData.status || null,
      progress: followUpData.progress || null,
      nextCheckIn: followUpData.nextCheckIn || null,
      totalDays: followUpData.totalDays || null,
      currentDay: followUpData.currentDay || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.followUps.set(id, followUp);
    return followUp;
  }

  async updateFollowUp(id: string, followUpData: Partial<InsertFollowUp>): Promise<FollowUp> {
    const existingFollowUp = this.followUps.get(id);
    if (!existingFollowUp) {
      throw new Error("Follow-up not found");
    }
    const updatedFollowUp = {
      ...existingFollowUp,
      ...followUpData,
      updatedAt: new Date(),
    };
    this.followUps.set(id, updatedFollowUp);
    return updatedFollowUp;
  }

  // Chat messages
  async getChatMessagesByUser(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => (a.createdAt || new Date()).getTime() - (b.createdAt || new Date()).getTime());
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      userId: messageData.userId,
      message: messageData.message,
      response: messageData.response,
      isVoice: messageData.isVoice || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Doctor operations
  async getDoctor(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorByLicense(licenseNumber: string): Promise<Doctor | undefined> {
    return Array.from(this.doctors.values()).find(doctor => doctor.licenseNumber === licenseNumber);
  }

  async createDoctor(doctorData: InsertDoctor): Promise<Doctor> {
    const id = randomUUID();
    const doctor: Doctor = {
      id,
      licenseNumber: doctorData.licenseNumber,
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      specialty: doctorData.specialty || null,
      email: doctorData.email || null,
      isVerified: doctorData.isVerified || null,
      createdAt: new Date(),
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Medical resources
  async getMedicalResources(): Promise<MedicalResource[]> {
    return Array.from(this.medicalResources.values())
      .sort((a, b) => (a.priority || 1) - (b.priority || 1));
  }

  async getMedicalResourcesByCategory(category: string): Promise<MedicalResource[]> {
    return Array.from(this.medicalResources.values())
      .filter(resource => resource.category === category)
      .sort((a, b) => (a.priority || 1) - (b.priority || 1));
  }

  async createMedicalResource(resourceData: InsertMedicalResource): Promise<MedicalResource> {
    const id = randomUUID();
    const resource: MedicalResource = {
      id,
      title: resourceData.title,
      category: resourceData.category,
      content: resourceData.content,
      tags: resourceData.tags,
      priority: resourceData.priority || null,
      lastUpdated: new Date(),
    };
    this.medicalResources.set(id, resource);
    return resource;
  }
}

export const storage = new MemStorage();
