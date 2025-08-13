// Service Worker and IndexedDB utilities for offline functionality

interface MedicalResource {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  priority: number;
  lastUpdated: string;
}

interface CacheConfig {
  dbName: string;
  dbVersion: number;
  storeName: string;
  cacheName: string;
}

const CONFIG: CacheConfig = {
  dbName: "MediCareOfflineDB",
  dbVersion: 1,
  storeName: "medicalResources",
  cacheName: "medicare-offline-v1",
};

class OfflineService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initializeServiceWorker();
    this.initializeIndexedDB();
  }

  // Initialize Service Worker for offline functionality
  private async initializeServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered successfully:", registration);
        
        // Listen for updates
        registration.addEventListener("updatefound", () => {
          console.log("Service Worker update found");
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  // Initialize IndexedDB for storing medical resources
  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CONFIG.dbName, CONFIG.dbVersion);

      request.onerror = () => {
        console.error("IndexedDB initialization failed:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("IndexedDB initialized successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store for medical resources
        if (!db.objectStoreNames.contains(CONFIG.storeName)) {
          const store = db.createObjectStore(CONFIG.storeName, { keyPath: "id" });
          store.createIndex("category", "category", { unique: false });
          store.createIndex("priority", "priority", { unique: false });
          store.createIndex("lastUpdated", "lastUpdated", { unique: false });
          console.log("IndexedDB object store created");
        }
      };
    });
  }

  // Cache medical resources for offline access
  async cacheResources(resources: MedicalResource[]): Promise<void> {
    if (!this.db) {
      throw new Error("IndexedDB not initialized");
    }

    const transaction = this.db.transaction([CONFIG.storeName], "readwrite");
    const store = transaction.objectStore(CONFIG.storeName);

    try {
      // Clear existing resources
      await new Promise<void>((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });

      // Add new resources
      for (const resource of resources) {
        await new Promise<void>((resolve, reject) => {
          const addRequest = store.add(resource);
          addRequest.onsuccess = () => resolve();
          addRequest.onerror = () => reject(addRequest.error);
        });
      }

      console.log(`Cached ${resources.length} medical resources offline`);
    } catch (error) {
      console.error("Failed to cache resources:", error);
      throw error;
    }
  }

  // Get cached resources from IndexedDB
  async getCachedResources(): Promise<MedicalResource[]> {
    if (!this.db) {
      console.warn("IndexedDB not initialized, returning empty array");
      return [];
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.storeName], "readonly");
      const store = transaction.objectStore(CONFIG.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const resources = request.result as MedicalResource[];
        // Sort by priority (critical resources first)
        resources.sort((a, b) => a.priority - b.priority);
        resolve(resources);
      };

      request.onerror = () => {
        console.error("Failed to get cached resources:", request.error);
        reject(request.error);
      };
    });
  }

  // Get cached resources by category
  async getCachedResourcesByCategory(category: string): Promise<MedicalResource[]> {
    if (!this.db) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG.storeName], "readonly");
      const store = transaction.objectStore(CONFIG.storeName);
      const index = store.index("category");
      const request = index.getAll(category);

      request.onsuccess = () => {
        const resources = request.result as MedicalResource[];
        resources.sort((a, b) => a.priority - b.priority);
        resolve(resources);
      };

      request.onerror = () => {
        console.error("Failed to get cached resources by category:", request.error);
        reject(request.error);
      };
    });
  }

  // Download essential resources for offline use
  async downloadEssentialResources(): Promise<void> {
    try {
      const response = await fetch("/api/medical-resources?category=emergency");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }

      const emergencyResources: MedicalResource[] = await response.json();
      
      // Also fetch first-aid resources
      const firstAidResponse = await fetch("/api/medical-resources?category=first-aid");
      const firstAidResources: MedicalResource[] = firstAidResponse.ok 
        ? await firstAidResponse.json() 
        : [];

      // Combine and prioritize critical resources
      const allResources = [...emergencyResources, ...firstAidResources];
      
      await this.cacheResources(allResources);
      
      // Cache the API responses in browser cache
      if ("caches" in window) {
        const cache = await caches.open(CONFIG.cacheName);
        await cache.addAll([
          "/api/medical-resources?category=emergency",
          "/api/medical-resources?category=first-aid",
        ]);
      }
      
      console.log("Essential medical resources downloaded for offline use");
    } catch (error) {
      console.error("Failed to download essential resources:", error);
      throw error;
    }
  }

  // Check if offline mode is active
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Get offline storage statistics
  async getStorageStats(): Promise<{
    resourceCount: number;
    storageUsed: string;
    lastUpdated: string;
  }> {
    const resources = await this.getCachedResources();
    
    let storageUsed = "Unknown";
    let lastUpdated = "Unknown";

    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usedMB = ((estimate.usage || 0) / 1024 / 1024).toFixed(2);
        storageUsed = `${usedMB} MB`;
      } catch (error) {
        console.warn("Could not estimate storage usage:", error);
      }
    }

    if (resources.length > 0) {
      const latestResource = resources.reduce((latest, current) => 
        new Date(current.lastUpdated) > new Date(latest.lastUpdated) ? current : latest
      );
      lastUpdated = new Date(latestResource.lastUpdated).toLocaleString();
    }

    return {
      resourceCount: resources.length,
      storageUsed,
      lastUpdated,
    };
  }

  // Clear offline cache
  async clearOfflineCache(): Promise<void> {
    try {
      // Clear IndexedDB
      if (this.db) {
        const transaction = this.db.transaction([CONFIG.storeName], "readwrite");
        const store = transaction.objectStore(CONFIG.storeName);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      // Clear Cache API
      if ("caches" in window) {
        await caches.delete(CONFIG.cacheName);
      }

      console.log("Offline cache cleared successfully");
    } catch (error) {
      console.error("Failed to clear offline cache:", error);
      throw error;
    }
  }

  // Search cached resources
  async searchCachedResources(query: string): Promise<MedicalResource[]> {
    const resources = await this.getCachedResources();
    const lowercaseQuery = query.toLowerCase();

    return resources.filter(resource => 
      resource.title.toLowerCase().includes(lowercaseQuery) ||
      resource.content.toLowerCase().includes(lowercaseQuery) ||
      resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// Export singleton instance
export const offlineService = new OfflineService();
