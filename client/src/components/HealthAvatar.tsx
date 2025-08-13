import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Target, TrendingUp } from "lucide-react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  healthScore?: number;
}

interface HealthAvatarProps {
  user?: User;
  className?: string;
}

interface HealthStats {
  level: number;
  experience: number;
  experienceToNext: number;
  achievements: string[];
  weeklyGoals: {
    completed: number;
    total: number;
  };
  streakDays: number;
}

export default function HealthAvatar({ user, className = "" }: HealthAvatarProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Simulate health gamification data
  const healthStats: HealthStats = {
    level: Math.floor((user?.healthScore || 85) / 10),
    experience: (user?.healthScore || 85) * 12,
    experienceToNext: 1000,
    achievements: ["First Check-up", "Medication Adherence", "Healthy Lifestyle"],
    weeklyGoals: {
      completed: 5,
      total: 7,
    },
    streakDays: 12,
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-health-green";
    if (score >= 70) return "text-medical-blue";
    if (score >= 50) return "text-medical-amber";
    return "text-red-600";
  };

  const getAvatarBorderColor = (score: number) => {
    if (score >= 90) return "border-health-green";
    if (score >= 70) return "border-medical-blue";
    if (score >= 50) return "border-medical-amber";
    return "border-red-500";
  };

  const experiencePercentage = (healthStats.experience / healthStats.experienceToNext) * 100;

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar Display */}
      <div className="relative inline-block">
        {/* Avatar Image */}
        <div className={`relative w-24 h-24 rounded-full border-4 overflow-hidden ${getAvatarBorderColor(user?.healthScore || 85)}`}>
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.firstName}'s health avatar`}
              className="w-full h-full object-cover"
              data-testid="health-avatar-image"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-medical-blue to-medical-purple flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.[0] || 'U'}
            </div>
          )}
          
          {/* Level Badge */}
          <div className="absolute -top-2 -right-2 bg-medical-amber text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white">
            {healthStats.level}
          </div>
          
          {/* Achievement Star */}
          <div className="absolute -bottom-2 -left-2 bg-health-green text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            <Star className="w-3 h-3" fill="currentColor" />
          </div>
        </div>

        {/* Health Score Display */}
        <div className="text-center mt-2">
          <div className={`text-2xl font-bold ${getHealthScoreColor(user?.healthScore || 85)}`} data-testid="health-score-display">
            {user?.healthScore || 85}/100
          </div>
          <p className="text-xs text-blue-100">Health Score</p>
          
          {/* Experience Progress Bar */}
          <div className="mt-2 w-24">
            <Progress value={experiencePercentage} className="h-2" />
            <p className="text-xs text-blue-200 mt-1">
              Lv.{healthStats.level} → Lv.{healthStats.level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
        data-testid="button-toggle-avatar-details"
      >
        {showDetails ? "Hide Stats" : "View Stats"}
      </Button>

      {/* Detailed Stats Modal/Overlay */}
      {showDetails && (
        <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-80 z-50 bg-white shadow-xl" data-testid="avatar-details-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800">Health Profile</h3>
                <p className="text-sm text-slate-600">{user?.firstName} {user?.lastName}</p>
              </div>

              {/* Level and Experience */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Level {healthStats.level}</span>
                  <Badge className="bg-medical-amber text-white">
                    {healthStats.experience} XP
                  </Badge>
                </div>
                <Progress value={experiencePercentage} className="mb-2" />
                <p className="text-xs text-slate-600 text-center">
                  {healthStats.experienceToNext - healthStats.experience} XP to next level
                </p>
              </div>

              {/* Weekly Goals */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-medical-blue" />
                    Weekly Goals
                  </span>
                  <span className="text-sm text-slate-600">
                    {healthStats.weeklyGoals.completed}/{healthStats.weeklyGoals.total}
                  </span>
                </div>
                <Progress 
                  value={(healthStats.weeklyGoals.completed / healthStats.weeklyGoals.total) * 100} 
                  className="mb-2"
                />
                <p className="text-xs text-slate-600">
                  {healthStats.weeklyGoals.total - healthStats.weeklyGoals.completed} goals remaining this week
                </p>
              </div>

              {/* Streak Counter */}
              <div className="bg-gradient-to-r from-health-green/10 to-health-green/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-health-green" />
                    Health Streak
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-health-green">{healthStats.streakDays}</div>
                    <div className="text-xs text-slate-600">days</div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-medical-amber" />
                  Recent Achievements
                </h4>
                <div className="space-y-2">
                  {healthStats.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-amber-50 rounded">
                      <Star className="w-4 h-4 text-medical-amber" fill="currentColor" />
                      <span className="text-sm text-slate-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Score Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Score Breakdown</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Symptom Management</span>
                    <span className="font-medium text-health-green">95/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Medication Adherence</span>
                    <span className="font-medium text-medical-blue">85/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lifestyle Factors</span>
                    <span className="font-medium text-medical-amber">78/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Follow-up Compliance</span>
                    <span className="font-medium text-health-green">92/100</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full bg-medical-blue hover:bg-medical-blue-dark"
                data-testid="button-improve-score"
              >
                Get Tips to Improve Score
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
