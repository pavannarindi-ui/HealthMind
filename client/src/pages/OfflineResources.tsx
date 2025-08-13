import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft, WifiOff, Search, Download, Ambulance, PillBottle, Bandage, Info } from "lucide-react";
import { offlineService } from "@/lib/offlineService";

interface MedicalResource {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  priority: number;
  lastUpdated: string;
}

export default function OfflineResources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [cachedResources, setCachedResources] = useState<MedicalResource[]>([]);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load cached resources when offline
  useEffect(() => {
    if (isOffline) {
      offlineService.getCachedResources().then(setCachedResources);
    }
  }, [isOffline]);

  const { data: resources, isLoading } = useQuery<MedicalResource[]>({
    queryKey: ["/api/medical-resources"],
    enabled: !isOffline, // Only fetch when online
  });

  // Cache resources when online
  useEffect(() => {
    if (resources && !isOffline) {
      offlineService.cacheResources(resources);
    }
  }, [resources, isOffline]);

  const displayResources = isOffline ? cachedResources : (resources || []);

  const filteredResources = displayResources.filter((resource: MedicalResource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (resource.tags as string[]).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Resources", icon: Info },
    { id: "emergency", name: "Emergency", icon: Ambulance },
    { id: "drugs", name: "Medications", icon: PillBottle },
    { id: "first-aid", name: "First Aid", icon: Bandage },
  ];

  const handleDownloadForOffline = async () => {
    try {
      await offlineService.downloadEssentialResources();
      toast({
        title: "Resources Downloaded",
        description: "Essential medical resources are now available offline.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download offline resources. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading && !isOffline) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading medical resources...</p>
        </div>
      </div>
    );
  }

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
                <span className="text-lg font-bold text-slate-800">Offline Medical Resources</span>
              </div>
            </div>
            
            <div className={`flex items-center space-x-2 ${isOffline ? 'text-amber-600' : 'text-health-green'}`}>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isOffline ? "Offline Mode" : "Online"}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offline Status Alert */}
        {isOffline && (
          <Alert className="mb-6 border-amber-200 bg-amber-50" data-testid="offline-alert">
            <WifiOff className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You're currently offline. Showing cached medical resources. Some content may be limited.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <Card className="mb-8" data-testid="offline-resources-header">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Essential Medical Information
                </CardTitle>
                <p className="text-slate-600 mt-2">
                  Critical medical information available without internet connection
                </p>
              </div>
              
              {!isOffline && (
                <Button 
                  onClick={handleDownloadForOffline}
                  className="bg-health-green hover:bg-health-green-dark mt-4 md:mt-0"
                  data-testid="button-download-offline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download for Offline
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search medical resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-resources"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center space-x-1"
                      data-testid={`button-category-${category.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Resource Stats */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-medical-blue">
                      {filteredResources.length}
                    </div>
                    <div className="text-sm text-slate-600">Resources Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-health-green">
                      {filteredResources.filter(r => r.category === "emergency").length}
                    </div>
                    <div className="text-sm text-slate-600">Emergency Procedures</div>
                  </div>
                </div>
                
                <div className="text-right text-sm text-slate-500">
                  Last Updated: {isOffline ? "Cached" : "Just now"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card 
              key={resource.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              data-testid={`resource-card-${resource.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                    {resource.category === "emergency" && <Ambulance className="w-5 h-5 mr-2 text-red-500" />}
                    {resource.category === "drugs" && <PillBottle className="w-5 h-5 mr-2 text-blue-500" />}
                    {resource.category === "first-aid" && <Bandage className="w-5 h-5 mr-2 text-green-500" />}
                    {resource.title}
                  </CardTitle>
                  <Badge variant={resource.priority === 1 ? "destructive" : "secondary"}>
                    {resource.priority === 1 ? "Critical" : "Standard"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {resource.content.substring(0, 150)}...
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {(resource.tags as string[]).slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(resource.tags as string[]).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(resource.tags as string[]).length - 3} more
                    </Badge>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  data-testid={`button-view-${resource.id}`}
                >
                  View Full Content
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card className="text-center py-12" data-testid="no-resources-found">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Resources Found</h3>
              <p className="text-slate-600 mb-4">
                {isOffline ? 
                  "No cached resources match your search. Try connecting to the internet to access more content." :
                  "Try adjusting your search terms or category filter."
                }
              </p>
              {isOffline && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
