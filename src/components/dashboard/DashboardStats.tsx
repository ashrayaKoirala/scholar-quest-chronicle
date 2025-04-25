
import { useApp } from "@/context/AppContext";
import { appData } from "@/data/appData";
import { Award, BookOpen, CheckCircle, Timer } from "lucide-react";

export default function DashboardStats() {
  const { character, quests } = useApp();
  
  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const completionPercentage = totalQuests > 0 
    ? Math.round((completedQuests / totalQuests) * 100) 
    : 0;
  
  // Calculate total study subjects
  const subjectCount = Object.keys(appData.subjects).length;
  
  // Calculate total topics across all subjects
  const topicCount = Object.values(appData.subjects).reduce((acc, subject) => {
    const subjectTopics = Object.values(subject.units).reduce((unitAcc, unit) => {
      return unitAcc + unit.topics.length;
    }, 0);
    return acc + subjectTopics;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat-card flex items-center">
        <Award className="h-10 w-10 text-primary mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Character Level</p>
          <p className="text-2xl font-medium">
            {character ? character.level : 1}
          </p>
        </div>
      </div>
      
      <div className="stat-card flex items-center">
        <CheckCircle className="h-10 w-10 text-green-500 mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Quest Completion</p>
          <p className="text-2xl font-medium">
            {completionPercentage}%
            <span className="text-sm text-gray-500 ml-1">({completedQuests}/{totalQuests})</span>
          </p>
        </div>
      </div>
      
      <div className="stat-card flex items-center">
        <BookOpen className="h-10 w-10 text-blue-500 mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Study Topics</p>
          <p className="text-2xl font-medium">{topicCount}</p>
        </div>
      </div>
      
      <div className="stat-card flex items-center">
        <Timer className="h-10 w-10 text-amber-500 mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Study Subjects</p>
          <p className="text-2xl font-medium">{subjectCount}</p>
        </div>
      </div>
    </div>
  );
}
