
import { useApp } from "@/context/AppContext";
import { CharacterStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Award, Brain, Focus, BookOpen, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export default function CharacterCard() {
  const { character, updateCharacterStats } = useApp();
  
  const [stats, setStats] = useState<CharacterStats>(
    character?.stats || { wisdom: 1, focus: 1, memory: 1, discipline: 1 }
  );
  
  const handleStatChange = (stat: keyof CharacterStats, value: number) => {
    const newValue = Math.max(1, value); // Ensure minimum of 1
    setStats(prev => ({ ...prev, [stat]: newValue }));
  };
  
  const handleSave = () => {
    updateCharacterStats(stats);
    toast("Character stats updated", {
      description: "Your character stats have been updated successfully",
    });
  };
  
  // Calculate progress to next level
  const currentXP = character?.xp || 0;
  const nextLevelXP = character?.nextLevelXP || 100;
  const prevLevelXP = nextLevelXP / 1.5; // Approximate previous level XP
  
  const xpProgress = ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
  
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <span>Character Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {character?.level || 1}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium">Scholar</h3>
              <p className="text-sm text-gray-500">Level {character?.level || 1}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">
              XP: {character?.xp || 0} / {character?.nextLevelXP || 100}
            </p>
            <div className="w-36 mt-1 progress-bar">
              <div 
                className="progress-value" 
                style={{ width: `${Math.max(0, Math.min(xpProgress || 0, 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Brain className="h-4 w-4" /> Wisdom
              </label>
              <Input
                type="number"
                min="1"
                value={stats.wisdom}
                onChange={(e) => handleStatChange("wisdom", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">Helps with understanding complex topics</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Focus className="h-4 w-4" /> Focus
              </label>
              <Input
                type="number"
                min="1"
                value={stats.focus}
                onChange={(e) => handleStatChange("focus", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">Increases concentration during study sessions</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> Memory
              </label>
              <Input
                type="number"
                min="1"
                value={stats.memory}
                onChange={(e) => handleStatChange("memory", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">Improves retention of information</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Discipline
              </label>
              <Input
                type="number"
                min="1"
                value={stats.discipline}
                onChange={(e) => handleStatChange("discipline", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">Helps maintain consistent study habits</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
