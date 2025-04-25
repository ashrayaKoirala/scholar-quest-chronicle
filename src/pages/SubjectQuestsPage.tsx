
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getDifficultyColor } from "@/utils/helpers";

function QuestList() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { getQuestsBySubject, setActiveTab, markQuestComplete } = useApp();
  
  useEffect(() => {
    // Update active tab based on subject
    if (subjectId) {
      setActiveTab(subjectId);
    }
  }, [subjectId, setActiveTab]);
  
  const quests = subjectId ? getQuestsBySubject(subjectId) : [];
  const incompleteQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);
  
  const formatSubjectName = (id: string) => {
    switch(id) {
      case "computerscience":
      case "computerScience":
        return "Computer Science";
      default:
        return id.charAt(0).toUpperCase() + id.slice(1);
    }
  };

  const handleCompleteQuest = (questId: string) => {
    markQuestComplete(questId);
  };

  return (
    <div className={`flex-1 ml-0 md:ml-64`}>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h2 className="text-3xl font-bold">{formatSubjectName(subjectId || '')} Quests</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track your learning progress for {formatSubjectName(subjectId || '')}
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Active Quests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Quests</CardTitle>
            </CardHeader>
            <CardContent>
              {incompleteQuests.length > 0 ? (
                <div className="space-y-4">
                  {incompleteQuests.map((quest) => (
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
                  No active quests for {formatSubjectName(subjectId || '')}. Add some quests to track your learning progress!
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Completed Quests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Completed Quests</CardTitle>
            </CardHeader>
            <CardContent>
              {completedQuests.length > 0 ? (
                <div className="space-y-4">
                  {completedQuests.map((quest) => (
                    <div key={quest.id} className="border-b pb-3 last:border-0 opacity-60">
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
                        <span className="text-green-500">
                          <CheckCircle2 className="h-5 w-5" />
                        </span>
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
                  You haven't completed any quests for {formatSubjectName(subjectId || '')} yet. Keep up the good work!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

const SubjectQuestsPage = () => {
  // Wrapper component with AppProvider
  return (
    <AppProvider>
      <div className="flex bg-bgLight dark:bg-gray-900 min-h-screen text-foreground">
        <Sidebar />
        <QuestList />
      </div>
    </AppProvider>
  );
};

export default SubjectQuestsPage;
