
import { useEffect } from "react";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useApp } from "@/context/AppContext";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UpcomingExams from "@/components/dashboard/UpcomingExams";
import ActiveQuests from "@/components/dashboard/ActiveQuests";
import CharacterSummary from "@/components/dashboard/CharacterSummary";
import SubjectOverview from "@/components/subject/SubjectOverview";
import CharacterCard from "@/components/character/CharacterCard";
import CharacterLevel from "@/components/character/CharacterLevel";
import ExamScheduleTable from "@/components/exams/ExamScheduleTable";
import StudyTimer from "@/components/timer/StudyTimer";
import FlashcardManager from "@/components/flashcards/FlashcardManager";
import QuestCreator from "@/components/quest/QuestCreator";
import { appData } from "@/data/appData";

function MainContent() {
  const { activeTab, sidebarOpen } = useApp();

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ActiveQuests />
                <QuestCreator />
              </div>
              <div className="space-y-8">
                <CharacterSummary />
                <UpcomingExams />
              </div>
            </div>
          </div>
        );
        
      case "physics":
        return <SubjectOverview subjectId="physics" />;
        
      case "mathematics":
        return <SubjectOverview subjectId="mathematics" />;
        
      case "computerscience":
        return <SubjectOverview subjectId="computerScience" />;
        
      case "character":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Character</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CharacterCard />
              <CharacterLevel />
            </div>
          </div>
        );
        
      case "exams":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Exam Schedule</h2>
            <div className="space-y-6">
              <ExamScheduleTable subject="Physics" exams={appData.examSchedule.physics} />
              <ExamScheduleTable subject="Mathematics" exams={appData.examSchedule.mathematics} />
              <ExamScheduleTable subject="Computer Science" exams={appData.examSchedule.computerScience} />
            </div>
          </div>
        );
        
      case "timer":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Study Timer</h2>
            <StudyTimer />
          </div>
        );
        
      case "flashcards":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Flashcards</h2>
            <FlashcardManager />
          </div>
        );
        
      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
      <Header />
      <main className="container mx-auto py-8 px-4">
        {renderContent()}
      </main>
    </div>
  );
}

const Index = () => {
  // Wrapper component with AppProvider
  return (
    <AppProvider>
      <div className="flex bg-bgLight min-h-screen">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
};

export default Index;
