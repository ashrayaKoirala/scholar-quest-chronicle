
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const { activeTab, toggleSidebar } = useApp();
  
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium">{formatTabName(activeTab)}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">
              Your learning journey awaits!
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
