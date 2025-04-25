
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appData } from "@/data/appData";
import { ArrowRight, Award } from "lucide-react";

export default function CharacterLevel() {
  const { character } = useApp();
  
  if (!character) return null;
  
  const currentXP = character.xp;
  const nextLevelXP = character.nextLevelXP;
  
  // Create an array of the next 5 levels
  const nextLevels = [];
  let levelXP = nextLevelXP;
  
  for (let i = 1; i <= 5; i++) {
    const level = character.level + i;
    if (level <= appData.character.levelingSystem.maxLevel) {
      nextLevels.push({
        level,
        xp: levelXP,
      });
      levelXP = Math.floor(
        levelXP * appData.character.levelingSystem.multiplier
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <span>Level Progression</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium">Current Status</h3>
          <p className="text-sm text-gray-500 mb-3">
            You are currently at level {character.level} with {character.xp} XP.
            You need {character.nextLevelXP - character.xp} more XP to reach level {character.level + 1}.
          </p>
          
          <div className="w-full progress-bar">
            <div 
              className="progress-value" 
              style={{ 
                width: `${Math.min(100, (character.xp / character.nextLevelXP) * 100)}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{character.xp} XP</span>
            <span>{character.nextLevelXP} XP</span>
          </div>
        </div>
        
        {nextLevels.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Upcoming Levels</h3>
            <div className="space-y-4">
              {nextLevels.map((nextLevel, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="font-bold">{nextLevel.level}</span>
                  </div>
                  <div className="flex-1">
                    <div className="progress-bar">
                      <div 
                        className="progress-value" 
                        style={{ 
                          width: `${Math.min(100, (character.xp / nextLevel.xp) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">
                        {nextLevel.xp - character.xp} XP needed
                      </span>
                      <span>{nextLevel.xp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {character.level === appData.character.levelingSystem.maxLevel && (
          <div className="text-center mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="font-medium">
              Congratulations! You've reached the maximum level.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
