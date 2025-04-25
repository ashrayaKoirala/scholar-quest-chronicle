
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

// List of character quotes based on level
const levelQuotes = [
  "Just starting your academic journey!",
  "Learning the basics of scholarly pursuits.",
  "Gaining momentum in your studies.",
  "Developing a solid foundation of knowledge.",
  "Starting to master complex concepts.",
  "Becoming quite the scholar now!",
  "Your wisdom grows with each completed quest.",
  "Academic prowess is becoming your strength.",
  "Your scholarly reputation is growing!",
  "The path to academic mastery continues."
];

export default function CharacterSummary() {
  const { character } = useApp();
  
  if (!character) return null;
  
  // Calculate progress to next level
  const currentXP = character.xp;
  const nextLevelXP = character.nextLevelXP;
  const prevLevelXP = nextLevelXP / 1.5; // Approximate previous level threshold
  
  const xpProgress = ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
  
  // Get appropriate quote based on level
  const quoteIndex = Math.min(Math.floor(character.level / 5), levelQuotes.length - 1);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <span>Character Level</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-primary">
              {character.level}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {levelQuotes[quoteIndex]}
          </p>
          
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>XP: {character.xp}</span>
              <span>Next: {character.nextLevelXP}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-value" 
                style={{ width: `${Math.max(0, Math.min(xpProgress, 100))}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            <div className="text-center p-2">
              <p className="text-gray-500 text-xs">Wisdom</p>
              <p className="text-xl font-medium">{character.stats.wisdom}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-gray-500 text-xs">Focus</p>
              <p className="text-xl font-medium">{character.stats.focus}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-gray-500 text-xs">Memory</p>
              <p className="text-xl font-medium">{character.stats.memory}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-gray-500 text-xs">Discipline</p>
              <p className="text-xl font-medium">{character.stats.discipline}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
