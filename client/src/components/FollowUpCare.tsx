import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, TrendingUp, CheckCircle, AlertCircle, PillBottle, Utensils, Moon } from "lucide-react";

interface FollowUp {
  id: string;
  userId: string;
  recordId: string;
  title: string;
  description: string;
  status: "active" | "completed" | "cancelled";
  progress: number;
  nextCheckIn: string;
  totalDays: number;
  currentDay: number;
  createdAt: string;
  updatedAt: string;
}

interface FollowUpCareProps {
  userId: string;
}

export default function FollowUpCare({ userId }: FollowUpCareProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followUps, isLoading } = useQuery({
    queryKey: ["/api/follow-ups", userId],
  });

  const updateFollowUpMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest("PUT", `/api/follow-ups/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups", userId] });
      toast({
        title: "Follow-up Updated",
        description: "Your progress has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateProgress = (followUpId: string, newProgress: number) => {
    updateFollowUpMutation.mutate({
      id: followUpId,
      updates: { progress: newProgress }
    });
  };

  const handleCompleteFollowUp = (followUpId: string) => {
    updateFollowUpMutation.mutate({
      id: followUpId,
      updates: { status: "completed", progress: 100 }
    });
  };

  const getRiskLevelColor = (progress: number) => {
    if (progress >= 80) return "text-health-green";
    if (progress >= 50) return "text-medical-amber";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-8" data-testid="follow-up-care-loading">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeFollowUps = Array.isArray(followUps) ? followUps.filter((fu: FollowUp) => fu.status === "active") : [];
  const completedFollowUps = Array.isArray(followUps) ? followUps.filter((fu: FollowUp) => fu.status === "completed") : [];

  return (
    <Card className="mb-8" data-testid="follow-up-care-main">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800">Follow-up Care</CardTitle>
        <p className="text-slate-600">Track your recovery and get personalized care recommendations</p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Follow-ups */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Active Follow-ups</h3>
            
            {activeFollowUps.length > 0 ? (
              activeFollowUps.map((followUp: FollowUp) => (
                <div key={followUp.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid={`follow-up-${followUp.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">{followUp.title}</span>
                    <Badge className={getStatusColor(followUp.status)}>
                      Day {followUp.currentDay} of {followUp.totalDays}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={followUp.progress} 
                    className="w-full mb-3"
                    data-testid={`progress-${followUp.id}`}
                  />
                  
                  <p className="text-sm text-blue-700 mb-3">{followUp.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-blue-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Next: {new Date(followUp.nextCheckIn).toLocaleDateString()}
                    </div>
                    <span className={`font-medium ${getRiskLevelColor(followUp.progress)}`}>
                      {followUp.progress}% Complete
                    </span>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateProgress(followUp.id, Math.min(100, followUp.progress + 25))}
                      disabled={updateFollowUpMutation.isPending}
                      data-testid={`button-update-progress-${followUp.id}`}
                    >
                      Update Progress
                    </Button>
                    
                    {followUp.progress >= 100 && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteFollowUp(followUp.id)}
                        disabled={updateFollowUpMutation.isPending}
                        data-testid={`button-complete-${followUp.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No active follow-ups</p>
                <p className="text-sm">New follow-ups will appear here after symptom analysis</p>
              </div>
            )}
          </div>
          
          {/* Today's Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Today's Recommendations</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <PillBottle className="text-medical-blue mt-1 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Medication Reminder</p>
                  <p className="text-xs text-slate-600">Take medications as prescribed</p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" data-testid="button-medication-reminder">
                      Mark as Taken
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <Utensils className="text-health-green mt-1 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Nutrition Advice</p>
                  <p className="text-xs text-slate-600">Stay hydrated and eat balanced meals</p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" data-testid="button-nutrition-advice">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <Moon className="text-medical-purple mt-1 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Rest & Recovery</p>
                  <p className="text-xs text-slate-600">Aim for 7-8 hours of quality sleep</p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" data-testid="button-rest-advice">
                      Sleep Tips
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Health Status Overview */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Health Status</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-green-600">GOOD</span>
                </div>
                <p className="text-sm text-slate-600">Overall health status based on follow-ups</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Active Care Plans</span>
                  <span className="text-slate-800 font-medium">{activeFollowUps.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Completed Plans</span>
                  <span className="text-green-600 font-medium">{completedFollowUps.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Compliance Rate</span>
                  <span className="text-green-600 font-medium">85%</span>
                </div>
              </div>
              
              {activeFollowUps.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-800 mb-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Progress Trend</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    Your recovery is progressing well. Keep following the care plan.
                  </p>
                </div>
              )}
              
              <Button 
                className="w-full" 
                variant="outline"
                data-testid="button-view-full-history"
              >
                View Full History
              </Button>
            </div>
          </div>
        </div>
        
        {/* Emergency Contact Section */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800 mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Emergency Contact</span>
          </div>
          <p className="text-sm text-red-700 mb-2">
            If you experience worsening symptoms or have concerns about your recovery:
          </p>
          <div className="flex space-x-4 text-sm">
            <Button variant="destructive" size="sm" data-testid="button-call-911">
              Call 911
            </Button>
            <Button variant="outline" size="sm" data-testid="button-contact-doctor">
              Contact Doctor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
