
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Character, 
  Quest, 
  FlashcardDeck,
  CharacterStats
} from "../types";
import { 
  getCharacter, 
  saveCharacter, 
  getQuests, 
  saveQuest, 
  completeQuest,
  getFlashcardDecks,
  saveFlashcardDeck,
  updateStats,
  addXP
} from "../utils/storage";

interface AppContextType {
  character: Character | null;
  quests: Quest[];
  flashcardDecks: FlashcardDeck[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addQuest: (quest: Omit<Quest, "id" | "completed">) => void;
  markQuestComplete: (questId: string) => void;
  updateCharacterStats: (stats: CharacterStats) => void;
  addCharacterXP: (amount: number) => void;
  addFlashcardDeck: (deck: Omit<FlashcardDeck, "id">) => void;
  updateFlashcardDeck: (deck: FlashcardDeck) => void;
  loading: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  getQuestsBySubject: (subject: string) => Quest[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for user preference in localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load character
        const loadedCharacter = getCharacter();
        setCharacter(loadedCharacter);
        
        // Load quests
        const loadedQuests = getQuests();
        setQuests(loadedQuests);
        
        // Load flashcard decks
        const loadedDecks = getFlashcardDecks();
        setFlashcardDecks(loadedDecks);
        
      } catch (error) {
        console.error("Failed to load app data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Set theme on initial load and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check for incomplete quests from previous days (shifted uncompleted quests feature)
  useEffect(() => {
    const checkForIncompleteQuests = () => {
      const today = new Date().toISOString().split('T')[0];
      const savedLastCheck = localStorage.getItem('last-quest-check-date');
      
      if (!savedLastCheck || savedLastCheck !== today) {
        // It's a new day, check for incomplete quests
        const incompleteQuests = quests.filter(q => !q.completed);
        
        if (incompleteQuests.length > 0) {
          // Update the quests - in a real app, we might want to modify their dates
          // or mark them as shifted from previous days
          
          // Mark that we've checked today
          localStorage.setItem('last-quest-check-date', today);
        }
      }
    };
    
    if (quests.length > 0) {
      checkForIncompleteQuests();
    }
  }, [quests]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const addQuest = (questData: Omit<Quest, "id" | "completed">) => {
    const newQuest: Quest = {
      ...questData,
      id: Date.now().toString(),
      completed: false,
    };
    
    saveQuest(newQuest);
    setQuests((prev) => [...prev, newQuest]);
  };

  const markQuestComplete = (questId: string) => {
    completeQuest(questId);
    
    // Update local state
    setQuests((prev) =>
      prev.map((quest) =>
        quest.id === questId ? { ...quest, completed: true } : quest
      )
    );
    
    // Refresh character data after XP update
    const updatedCharacter = getCharacter();
    setCharacter(updatedCharacter);
  };

  const updateCharacterStats = (stats: CharacterStats) => {
    if (character) {
      updateStats(stats);
      setCharacter({ ...character, stats });
    }
  };

  const addCharacterXP = (amount: number) => {
    const updatedCharacter = addXP(amount);
    if (updatedCharacter) {
      setCharacter(updatedCharacter);
    }
  };

  const addFlashcardDeck = (deckData: Omit<FlashcardDeck, "id">) => {
    const newDeck: FlashcardDeck = {
      ...deckData,
      id: Date.now().toString(),
    };
    
    saveFlashcardDeck(newDeck);
    setFlashcardDecks((prev) => [...prev, newDeck]);
  };

  const updateFlashcardDeck = (deck: FlashcardDeck) => {
    saveFlashcardDeck(deck);
    
    setFlashcardDecks((prev) =>
      prev.map((d) => (d.id === deck.id ? deck : d))
    );
  };

  // Get quests filtered by subject
  const getQuestsBySubject = (subject: string): Quest[] => {
    return quests.filter(quest => quest.subject.toLowerCase() === subject.toLowerCase());
  };

  return (
    <AppContext.Provider
      value={{
        character,
        quests,
        flashcardDecks,
        activeTab,
        setActiveTab,
        addQuest,
        markQuestComplete,
        updateCharacterStats,
        addCharacterXP,
        addFlashcardDeck,
        updateFlashcardDeck,
        loading,
        sidebarOpen,
        toggleSidebar,
        isDarkMode,
        toggleTheme,
        getQuestsBySubject
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
