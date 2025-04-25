
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, CheckCircle, Clock, File } from "lucide-react";
import { formatDate, daysUntil } from "@/utils/helpers";
import { Quest } from "@/types";
import { useApp } from "@/context/AppContext";

interface PlannedQuestData {
  date: string;
  objectives: string[];
  pastPaper: string;
}

interface PlannedQuestsProps {
  plannedData?: PlannedQuestData[];
}

export default function PlannedQuests({ plannedData }: PlannedQuestsProps) {
  const { addQuest } = useApp();
  const [plannedQuests, setPlannedQuests] = useState<PlannedQuestData[]>([]);
  const [completedDates, setCompletedDates] = useState<Record<string, boolean>>({});

  // Load from props or localStorage
  useEffect(() => {
    if (plannedData && plannedData.length > 0) {
      setPlannedQuests(plannedData);
      
      // Save to localStorage for persistence
      localStorage.setItem('scholar-planned-quests', JSON.stringify(plannedData));
    } else {
      // Try to load from localStorage
      try {
        const stored = localStorage.getItem('scholar-planned-quests');
        if (stored) {
          setPlannedQuests(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error loading planned quests", e);
      }
    }
    
    // Load completed states
    try {
      const stored = localStorage.getItem('scholar-planned-quests-completed');
      if (stored) {
        setCompletedDates(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading completed quests", e);
    }
  }, [plannedData]);

  // Save completed dates to localStorage
  useEffect(() => {
    localStorage.setItem('scholar-planned-quests-completed', JSON.stringify(completedDates));
  }, [completedDates]);

  // Filter for quests that are upcoming or today
  const relevantQuests = plannedQuests.filter(quest => {
    const days = daysUntil(quest.date);
    return days >= -1; // Include yesterday through future dates
  });

  // Sort quests by date (closest first)
  const sortedQuests = [...relevantQuests].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const handleMarkComplete = (date: string) => {
    setCompletedDates(prev => ({
      ...prev,
      [date]: true
    }));
  };

  const handleAddToQuests = (plannedQuest: PlannedQuestData) => {
    // For each objective, create a new quest
    plannedQuest.objectives.forEach((objective, index) => {
      const newQuest: Omit<Quest, "id" | "completed"> = {
        title: objective,
        description: `Study task from ${formatDate(plannedQuest.date)}`,
        subject: guessSubjectFromObjective(objective),
        unit: "Unit 5", // Default unit
        topic: objective,
        type: "learning",
        difficulty: "intermediate",
        xpReward: 75
      };
      
      addQuest(newQuest);
    });
    
    // Also add the past paper as a quest
    if (plannedQuest.pastPaper) {
      const pastPaperQuest: Omit<Quest, "id" | "completed"> = {
        title: `Complete ${plannedQuest.pastPaper} past paper`,
        description: `Past paper practice from ${formatDate(plannedQuest.date)}`,
        subject: guessPaperSubject(plannedQuest.pastPaper),
        unit: "Unit 5",
        topic: "Past Paper Practice",
        type: "assessment",
        difficulty: "advanced",
        xpReward: 100
      };
      
      addQuest(pastPaperQuest);
    }
    
    // Mark as completed
    handleMarkComplete(plannedQuest.date);
  };

  // Helper function to guess subject from objective text
  const guessSubjectFromObjective = (objective: string): string => {
    const objective_lower = objective.toLowerCase();
    
    if (objective_lower.includes("circuit") || 
        objective_lower.includes("magnetic") || 
        objective_lower.includes("electric") || 
        objective_lower.includes("field") || 
        objective_lower.includes("motion") ||
        objective_lower.includes("physics") ||
        objective_lower.includes("quantum") ||
        objective_lower.includes("thermodynamic") ||
        objective_lower.includes("wave")) {
      return "physics";
    }
    
    if (objective_lower.includes("algorithm") || 
        objective_lower.includes("program") || 
        objective_lower.includes("file") || 
        objective_lower.includes("processor") ||
        objective_lower.includes("boolean") ||
        objective_lower.includes("encryption") ||
        objective_lower.includes("protocol")) {
      return "computerScience";
    }
    
    if (objective_lower.includes("algebra") || 
        objective_lower.includes("geometry") || 
        objective_lower.includes("calcul") || 
        objective_lower.includes("proof") ||
        objective_lower.includes("vector") ||
        objective_lower.includes("trigonometry") ||
        objective_lower.includes("logarithm")) {
      return "mathematics";
    }
    
    return "physics"; // Default
  };
  
  // Helper function to guess subject from paper name
  const guessPaperSubject = (paper: string): string => {
    const paper_lower = paper.toLowerCase();
    
    if (paper_lower.includes("maths") || paper_lower.includes("p3") || paper_lower.includes("d1")) {
      return "mathematics";
    }
    
    if (paper_lower.includes("cs") || paper_lower.includes("comp")) {
      return "computerScience";
    }
    
    return "physics"; // Default
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Study Planner</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedQuests.length > 0 ? (
          <div className="space-y-4">
            {sortedQuests.map((questItem) => {
              const days = daysUntil(questItem.date);
              const isToday = days === 0;
              const isPast = days < 0;
              const isCompleted = completedDates[questItem.date];
              
              return (
                <div 
                  key={questItem.date}
                  className={`border rounded-lg p-3 ${isToday ? "border-primary bg-primary/5" : ""} ${isPast ? "border-amber-200 bg-amber-50/50" : ""} ${isCompleted ? "border-green-200 bg-green-50/50" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={isToday ? "default" : isPast ? "outline" : "secondary"}>
                        {formatDate(questItem.date)}
                      </Badge>
                      {isToday && (
                        <Badge variant="outline" className="bg-primary/10">Today</Badge>
                      )}
                      {isPast && !isToday && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">Yesterday</Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                      )}
                    </div>
                    {!isCompleted && (
                      <Button size="sm" onClick={() => handleAddToQuests(questItem)}>
                        <Check className="h-4 w-4 mr-1" /> Add to Quests
                      </Button>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Study Objectives:
                  </h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 mb-2">
                    {questItem.objectives.map((objective, idx) => (
                      <li key={idx}>{objective}</li>
                    ))}
                  </ul>
                  
                  {questItem.pastPaper && (
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <File className="h-3.5 w-3.5" />
                      <span>Past Paper: {questItem.pastPaper}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No upcoming study plans found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
