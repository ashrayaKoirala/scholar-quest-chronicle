
import { useState } from "react";
import { Atom, Book, Calendar, Code, PiSquare, BookOpen, Timer, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const NavItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all",
        isActive
          ? "bg-primary text-white font-medium"
          : "text-gray-600 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen } = useApp();

  const navItems = [
    { id: "dashboard", icon: BookOpen, label: "Dashboard" },
    { id: "physics", icon: Atom, label: "Physics" },
    { id: "mathematics", icon: PiSquare, label: "Mathematics" },
    { id: "computerscience", icon: Code, label: "Computer Science" },
    { id: "character", icon: Award, label: "Character" },
    { id: "exams", icon: Calendar, label: "Exam Schedule" },
    { id: "timer", icon: Timer, label: "Study Timer" },
    { id: "flashcards", icon: Book, label: "Flashcards" },
  ];

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0 overflow-y-auto",
        sidebarOpen ? "w-64" : "w-0 -translate-x-full"
      )}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">Scholar's Chronicle</h2>
        <p className="text-sm text-gray-500 mt-1">Your study companion</p>
      </div>

      <div className="px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
