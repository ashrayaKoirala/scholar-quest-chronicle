
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flashcard, FlashcardDeck } from "@/types";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { useApp } from "@/context/AppContext";

interface FlashcardStudyProps {
  deck: FlashcardDeck;
}

export default function FlashcardStudy({ deck }: FlashcardStudyProps) {
  const { updateFlashcardDeck, addCharacterXP } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [studyComplete, setStudyComplete] = useState(false);
  
  // If deck is empty, show message
  if (deck.cards.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8">
        <p className="text-center text-gray-500">
          This deck has no flashcards yet. Add some cards to start studying!
        </p>
      </Card>
    );
  }
  
  const currentCard = deck.cards[currentIndex];
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      completeStudySession();
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setStudyComplete(false);
  };
  
  const completeStudySession = () => {
    setStudyComplete(true);
    
    // Update the last reviewed date for all cards
    const updatedCards = deck.cards.map(card => ({
      ...card,
      lastReviewed: new Date().toISOString(),
      reviewCount: (card.reviewCount || 0) + 1
    }));
    
    const updatedDeck = {
      ...deck,
      cards: updatedCards
    };
    
    updateFlashcardDeck(updatedDeck);
    
    // Award XP for completing the study session
    addCharacterXP(10);
  };
  
  if (studyComplete) {
    return (
      <Card className="flex flex-col items-center justify-center p-8">
        <h3 className="text-xl font-medium mb-4">Study Session Complete!</h3>
        <p className="text-gray-500 mb-6 text-center">
          Great job! You've reviewed all {deck.cards.length} flashcards in this deck.
        </p>
        <Button onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Study Again
        </Button>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Card {currentIndex + 1} of {deck.cards.length}
        </p>
        <p className="text-sm text-gray-500">
          {deck.subject} • {deck.unit} • {deck.topic}
        </p>
      </div>
      
      <Card 
        className="min-h-[260px] cursor-pointer"
        onClick={handleFlip}
      >
        <CardContent className="flex items-center justify-center p-8 h-full">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              {flipped ? "Back" : "Front"}
            </p>
            <p className="text-lg">
              {flipped ? currentCard.back : currentCard.front}
            </p>
            {currentCard.lastReviewed && (
              <p className="text-xs text-gray-400 mt-4">
                Last reviewed: {formatDate(new Date(currentCard.lastReviewed).toISOString().split('T')[0])}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <Button onClick={handleNext}>
          {currentIndex < deck.cards.length - 1 ? (
            <>Next <ChevronRight className="h-4 w-4 ml-2" /></>
          ) : (
            "Complete"
          )}
        </Button>
      </div>
      
      <div className="flex justify-center">
        <p className="text-sm text-gray-500 italic">
          Click on the card to flip it
        </p>
      </div>
    </div>
  );
}
