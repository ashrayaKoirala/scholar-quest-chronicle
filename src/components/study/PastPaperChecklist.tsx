
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Check, CheckSquare } from "lucide-react";

// Define types for our component
interface PastPaperProps {
  subject: string;
  years: number[];
  months: string[];
}

interface CompletionState {
  [key: string]: boolean;
}

export default function PastPaperChecklist({ subject, years = [2019, 2020, 2021, 2022, 2023, 2024], months = ["May", "October", "January"] }: PastPaperProps) {
  // Initialize completion state from localStorage
  const storageKey = `past-papers-${subject.toLowerCase()}`;
  const initialState = loadCompletionState(storageKey);
  const [completionState, setCompletionState] = useState<CompletionState>(initialState);
  
  // Load completion state from localStorage
  function loadCompletionState(key: string): CompletionState {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Error loading past paper completion state", e);
      return {};
    }
  }
  
  // Save completion state to localStorage
  function saveCompletionState(state: CompletionState) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.error("Error saving past paper completion state", e);
    }
  }
  
  // Toggle the completion state of a paper
  const toggleCompletion = (paperId: string) => {
    setCompletionState(prev => {
      const newState = {
        ...prev,
        [paperId]: !prev[paperId]
      };
      
      // Save to localStorage
      saveCompletionState(newState);
      
      return newState;
    });
  };
  
  // Count completed papers for a year
  const countCompletedForYear = (year: number) => {
    return months.reduce((count, month) => {
      const paperKey = `${year}-${month}`;
      return completionState[paperKey] ? count + 1 : count;
    }, 0);
  };
  
  // Calculate overall completion percentage
  const calculateOverallCompletion = () => {
    const total = years.length * months.length;
    const completed = Object.values(completionState).filter(Boolean).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  // Get styled background for completion badges
  const getCompletionBg = (percentage: number) => {
    if (percentage >= 100) return "bg-green-100 text-green-800";
    if (percentage >= 75) return "bg-emerald-100 text-emerald-800";
    if (percentage >= 50) return "bg-amber-100 text-amber-800";
    if (percentage >= 25) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{subject} Past Papers</CardTitle>
            <CardDescription>Track your progress through past papers</CardDescription>
          </div>
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${getCompletionBg(calculateOverallCompletion())}`}>
            {calculateOverallCompletion()}% Complete
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={years[years.length - 1].toString()}>
          <TabsList className="mb-4 flex flex-wrap">
            {years.map(year => (
              <TabsTrigger key={year} value={year.toString()} className="relative">
                {year}
                {countCompletedForYear(year) > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {countCompletedForYear(year)}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {years.map(year => (
            <TabsContent key={year} value={year.toString()} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {months.map(month => {
                  const paperId = `${year}-${month}`;
                  const isCompleted = completionState[paperId];
                  
                  return (
                    <div key={paperId} className="flex items-center space-x-2">
                      <Checkbox 
                        id={paperId}
                        checked={isCompleted}
                        onCheckedChange={() => toggleCompletion(paperId)}
                      />
                      <Label 
                        htmlFor={paperId}
                        className={`text-sm flex-1 ${isCompleted ? 'line-through text-gray-500' : ''}`}
                      >
                        {month} {year}
                      </Label>
                      {isCompleted && (
                        <CheckSquare className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
