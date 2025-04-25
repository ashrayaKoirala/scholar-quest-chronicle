
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
        toggleSidebar
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
