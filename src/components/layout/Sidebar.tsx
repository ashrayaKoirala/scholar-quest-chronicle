
import { useState } from "react";
import { Atom, Book, Calendar, Code, PiSquare, BookOpen, Timer, Award, FileText, Moon, Sun, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const NavItem = ({ icon: Icon, label, isActive, onClick, className }: NavItemProps) => {
  return (
    <button
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all",
        isActive
          ? "bg-primary dark:bg-primary/80 text-white font-medium"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, toggleSidebar } = useApp();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for user preference in localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const navItems = [
    { id: "dashboard", icon: BookOpen, label: "Dashboard" },
    { id: "physics", icon: Atom, label: "Physics" },
    { id: "mathematics", icon: PiSquare, label: "Mathematics" },
    { id: "computerscience", icon: Code, label: "Computer Science" },
    { id: "character", icon: Award, label: "Character" },
    { id: "exams", icon: Calendar, label: "Exam Schedule" },
    { id: "timer", icon: Timer, label: "Study Timer" },
    { id: "flashcards", icon: Book, label: "Flashcards" },
    { id: "notes", icon: FileText, label: "Notes" },
  ];

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Add or remove the 'dark' class from the html element
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Set the theme on initial load
  if (typeof window !== 'undefined' && isDarkMode) {
    document.documentElement.classList.add('dark');
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen sticky top-0 overflow-y-auto shadow-md",
        sidebarOpen ? "w-64" : "w-0 -translate-x-full"
      )}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary dark:text-primary-foreground">Scholar's Chronicle</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your study companion</p>
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

        <div className="mt-6 px-4">
          <Button 
            onClick={toggleTheme} 
            variant="outline" 
            size="sm"
            className="w-full justify-start gap-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <div className="md:hidden mt-4 px-4">
          <Button
            onClick={toggleSidebar}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Menu size={16} />
            Close Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
