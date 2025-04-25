
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { getDifficultyColor } from "@/utils/helpers";
import { useState } from "react";

export default function ActiveQuests() {
  const { quests, markQuestComplete } = useApp();
  const [expanded, setExpanded] = useState(false);
  
  // Filter for incomplete quests
  const incompleteQuests = quests.filter(q => !q.completed);
  
  // Limit display unless expanded
  const displayQuests = expanded ? incompleteQuests : incompleteQuests.slice(0, 3);

  const handleCompleteQuest = (questId: string) => {
    markQuestComplete(questId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Active Quests</CardTitle>
      </CardHeader>
      <CardContent>
        {displayQuests.length > 0 ? (
          <div className="space-y-4">
            {displayQuests.map((quest) => (
              <div key={quest.id} className="border-b pb-3 last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{quest.title}</h4>
                    <p className="text-sm text-gray-500">{quest.description}</p>
                    <div className="flex mt-2 gap-2">
                      <Badge variant="outline">{quest.type}</Badge>
                      <Badge 
                        className={`${getDifficultyColor(quest.difficulty)} text-white`}
                      >
                        {quest.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCompleteQuest(quest.id)}
                    className="text-gray-400 hover:text-green-500"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-400">
                    <span className="font-medium">{quest.subject}</span> • {quest.unit} • {quest.topic}
                  </p>
                  <p className="text-xs text-primary font-medium mt-1">
                    +{quest.xpReward} XP
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No active quests. Add some quests to track your learning progress!
          </p>
        )}
        
        {incompleteQuests.length > 3 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : `Show ${incompleteQuests.length - 3} More`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
