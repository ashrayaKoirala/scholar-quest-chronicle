
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { appData } from "@/data/appData";
import { FlashcardDeck, Flashcard, Subject } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateId } from "@/utils/helpers";
import { Book, Plus, Save, Trash } from "lucide-react";
import FlashcardStudy from "./FlashcardStudy";
import FlashcardImport from "./FlashcardImport";

export default function FlashcardManager() {
  const { flashcardDecks, addFlashcardDeck, updateFlashcardDeck } = useApp();
  
  const [activeTab, setActiveTab] = useState<string>("decks");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  
  // Form state
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [newDeckSubject, setNewDeckSubject] = useState<string>("physics");
  const [newDeckUnit, setNewDeckUnit] = useState<string>("");
  const [newDeckTopic, setNewDeckTopic] = useState<string>("");
  
  // Card creation state
  const [newCardFront, setNewCardFront] = useState<string>("");
  const [newCardBack, setNewCardBack] = useState<string>("");
  
  const getSelectedDeck = (): FlashcardDeck | undefined => {
    return flashcardDecks.find((deck) => deck.id === selectedDeckId);
  };
  
  const subjects = Object.entries(appData.subjects);
  
  const getUnitsForSubject = (subjectId: string): { id: string, name: string }[] => {
    const subject = appData.subjects[subjectId as keyof typeof appData.subjects];
    if (!subject) return [];
    
    return Object.entries(subject.units).map(([unitId, unit]) => ({
      id: unitId,
      name: unit.name
    }));
  };
  
  const getTopicsForSubjectAndUnit = (subjectId: string, unitId: string): string[] => {
    const subject = appData.subjects[subjectId as keyof typeof appData.subjects];
    if (!subject || !unitId) return [];
    
    const unit = subject.units[unitId];
    return unit ? unit.topics : [];
  };
  
  const handleCreateDeck = () => {
    if (!newDeckName || !newDeckSubject || !newDeckUnit || !newDeckTopic) {
      return;
    }
    
    const newDeck: Omit<FlashcardDeck, "id"> = {
      name: newDeckName,
      subject: newDeckSubject,
      unit: newDeckUnit,
      topic: newDeckTopic,
      cards: []
    };
    
    addFlashcardDeck(newDeck);
    
    // Reset form
    setNewDeckName("");
    setNewDeckUnit("");
    setNewDeckTopic("");
  };
  
  const handleAddCard = () => {
    const selectedDeck = getSelectedDeck();
    if (!selectedDeck || !newCardFront || !newCardBack) {
      return;
    }
    
    // Check if we've reached the maximum number of cards
    if (selectedDeck.cards.length >= appData.studyTools.flashcards.maxCardsPerDeck) {
      alert(`You can't add more than ${appData.studyTools.flashcards.maxCardsPerDeck} cards to a deck.`);
      return;
    }
    
    const newCard: Flashcard = {
      id: generateId(),
      front: newCardFront,
      back: newCardBack,
      deckId: selectedDeck.id,
      lastReviewed: null,
      nextReviewDate: null,
      reviewCount: 0
    };
    
    const updatedDeck = {
      ...selectedDeck,
      cards: [...selectedDeck.cards, newCard]
    };
    
    updateFlashcardDeck(updatedDeck);
    
    // Reset form
    setNewCardFront("");
    setNewCardBack("");
  };
  
  const handleDeleteCard = (cardId: string) => {
    const selectedDeck = getSelectedDeck();
    if (!selectedDeck) return;
    
    const updatedDeck = {
      ...selectedDeck,
      cards: selectedDeck.cards.filter((card) => card.id !== cardId)
    };
    
    updateFlashcardDeck(updatedDeck);
  };
  
  const selectDeck = (deckId: string) => {
    setSelectedDeckId(deckId);
    setActiveTab("study");
  };

  const handleImportComplete = () => {
    setActiveTab("study");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="decks">Decks</TabsTrigger>
          <TabsTrigger 
            value="create" 
            disabled={activeTab === "study" || activeTab === "import"}
          >
            Create Deck
          </TabsTrigger>
          <TabsTrigger 
            value="study" 
            disabled={!selectedDeckId}
          >
            Study
          </TabsTrigger>
          <TabsTrigger 
            value="import" 
            disabled={!selectedDeckId}
          >
            Import CSV
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="decks" className="space-y-4">
          {flashcardDecks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcardDecks.map((deck) => (
                <Card 
                  key={deck.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => selectDeck(deck.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span>{deck.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {deck.subject} • {deck.topic}
                    </p>
                    <p className="text-sm mt-2">
                      {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <p className="text-center text-gray-500 mb-4">
                  You don't have any flashcard decks yet. Create your first deck to start studying!
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Deck
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Deck</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Deck Name</label>
                  <Input 
                    value={newDeckName} 
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="e.g., Physics Formulas"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select 
                    value={newDeckSubject}
                    onValueChange={setNewDeckSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(([id, subject]) => (
                        <SelectItem key={id} value={id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Unit</label>
                  <Select
                    value={newDeckUnit}
                    onValueChange={setNewDeckUnit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnitsForSubject(newDeckSubject).map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Topic</label>
                  <Select
                    value={newDeckTopic}
                    onValueChange={setNewDeckTopic}
                    disabled={!newDeckUnit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTopicsForSubjectAndUnit(newDeckSubject, newDeckUnit).map((topic, index) => (
                        <SelectItem key={index} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  type="button"
                  onClick={handleCreateDeck}
                  disabled={!newDeckName || !newDeckSubject || !newDeckUnit || !newDeckTopic}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Deck
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          {selectedDeckId && (
            <FlashcardImport 
              onImportComplete={handleImportComplete} 
              selectedDeckId={selectedDeckId} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="study" className="space-y-4">
          {selectedDeckId && getSelectedDeck() && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{getSelectedDeck()?.name}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setActiveTab("import")}
                    >
                      Import from CSV
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FlashcardStudy deck={getSelectedDeck()!} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add New Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Front</label>
                      <Input 
                        value={newCardFront} 
                        onChange={(e) => setNewCardFront(e.target.value)}
                        placeholder="Question or term"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Back</label>
                      <Input 
                        value={newCardBack} 
                        onChange={(e) => setNewCardBack(e.target.value)}
                        placeholder="Answer or definition"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      onClick={handleAddCard}
                      disabled={!newCardFront || !newCardBack}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Card
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {getSelectedDeck()?.cards.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Cards in Deck ({getSelectedDeck()?.cards.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getSelectedDeck()?.cards.map((card) => (
                        <div key={card.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">{card.front}</p>
                            <p className="text-sm text-gray-500">{card.back}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
