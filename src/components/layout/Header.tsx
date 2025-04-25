
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const { activeTab, toggleSidebar, isDarkMode, toggleTheme } = useApp();
  
  // Format active tab name
  const formatTabName = (tab: string) => {
    switch(tab) {
      case "computerscience":
        return "Computer Science";
      default:
        return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="dark:text-gray-300 dark:hover:bg-gray-700">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium dark:text-white">{formatTabName(activeTab)}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="dark:text-gray-300"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <div className="hidden md:block">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your learning journey awaits!
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
