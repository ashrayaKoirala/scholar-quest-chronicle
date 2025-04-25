
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
import PlannedQuests from "@/components/quest/PlannedQuests";
import PastPaperChecklist from "@/components/study/PastPaperChecklist";
import PhysicsPlaylist from "@/components/physics/PhysicsPlaylist";
import NoteStorage from "@/components/notes/NoteStorage";
import { appData } from "@/data/appData";

// Planned quest data from requirements
const plannedQuestData = [
  {
    "date": "2025-04-26",
    "objectives": [
      "Motion in a Circle", "Gravitational Fields",
      "Proof", "Algebra and Functions",
      "User-defined data types"
    ],
    "pastPaper": "Maths D1"
  },
  {
    "date": "2025-04-27",
    "objectives": [
      "Temperature", "Ideal Gases",
      "Coordinate Geometry", "Sequences and Series",
      "File Organisation", "Floating-Point Numbers"
    ],
    "pastPaper": "CS P3"
  },
  {
    "date": "2025-04-28",
    "objectives": [
      "Thermodynamics", "Oscillations",
      "Trigonometry", "Protocols", "Circuit/Packet Switching"
    ],
    "pastPaper": "Maths P3"
  },
  {
    "date": "2025-04-29",
    "objectives": [
      "Electric Fields", "Capacitance",
      "Processors", "Parallel Processing", "VMs"
    ],
    "pastPaper": "CS P4"
  },
  {
    "date": "2025-04-30",
    "objectives": [
      "Magnetic Fields", "Alternating Currents",
      "Exponentials and Logarithms",
      "Boolean Algebra and Logic Circuits",
      "Operating System Purposes"
    ],
    "pastPaper": "Maths D1"
  },
  {
    "date": "2025-05-01",
    "objectives": [
      "Quantum Physics", "Nuclear Physics",
      "Differentiation", "Translation Software", "Encryption"
    ],
    "pastPaper": "Maths P3"
  },
  {
    "date": "2025-05-02",
    "objectives": [
      "Astronomy and Cosmology",
      "Integration", "Numerical Methods",
      "Encryption Protocols", "Artificial Intelligence"
    ],
    "pastPaper": "CS P3"
  },
  {
    "date": "2025-05-03",
    "objectives": [
      "Vectors",
      "Algorithms and Graph Theory",
      "Algorithms on Graphs I", "Algorithms on Graphs II",
      "Algorithms (CS)"
    ],
    "pastPaper": "Maths D1"
  },
  {
    "date": "2025-05-04",
    "objectives": [
      "Critical Path Analysis", "Linear Programming", "Transportation Problems",
      "Recursion", "Programming Paradigms",
      "File Processing and Exception Handling"
    ],
    "pastPaper": "CS P4"
  }
];

// The years and months for past papers
const pastPaperYears = [2019, 2020, 2021, 2022, 2023, 2024];
const pastPaperMonths = ["May", "October", "January"];

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
                <PlannedQuests plannedData={plannedQuestData} />
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
        return (
          <div className="space-y-8">
            <SubjectOverview subjectId="physics" />
            <div className="grid grid-cols-1 gap-8">
              <PhysicsPlaylist />
              <PastPaperChecklist subject="Physics" years={pastPaperYears} months={pastPaperMonths} />
            </div>
          </div>
        );
        
      case "mathematics":
        return (
          <div className="space-y-8">
            <SubjectOverview subjectId="mathematics" />
            <PastPaperChecklist subject="Mathematics" years={pastPaperYears} months={pastPaperMonths} />
          </div>
        );
        
      case "computerscience":
        return (
          <div className="space-y-8">
            <SubjectOverview subjectId="computerScience" />
            <PastPaperChecklist subject="Computer Science" years={pastPaperYears} months={pastPaperMonths} />
          </div>
        );
        
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
        
      case "notes":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Study Notes</h2>
            <NoteStorage />
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
      {activeTab === "physics" && <PhysicsPlaylist />}
    </div>
  );
}

const Index = () => {
  // Wrapper component with AppProvider
  return (
    <AppProvider>
      <div className="flex bg-bgLight dark:bg-gray-900 min-h-screen text-foreground">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
};

export default Index;
