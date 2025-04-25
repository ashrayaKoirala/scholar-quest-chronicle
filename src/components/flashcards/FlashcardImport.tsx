
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload } from "lucide-react";
import { Flashcard, FlashcardDeck } from "@/types";
import { generateId } from "@/utils/helpers";
import { useApp } from "@/context/AppContext";

interface FlashcardImportProps {
  onImportComplete: () => void;
  selectedDeckId: string | null;
}

export default function FlashcardImport({ onImportComplete, selectedDeckId }: FlashcardImportProps) {
  const { flashcardDecks, updateFlashcardDeck } = useApp();
  const [csvContent, setCsvContent] = useState<Array<[string, string]>>([]);
  const [error, setError] = useState<string | null>(null);

  const parseCsv = (content: string) => {
    // Split by lines
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
    
    // Parse each line (simple CSV parsing)
    const parsed: Array<[string, string]> = [];
    
    for (const line of lines) {
      // Check if line contains a comma
      if (line.includes(",")) {
        const [front, ...rest] = line.split(",");
        const back = rest.join(","); // In case there are commas in the answer
        
        if (front && back) {
          parsed.push([front.trim(), back.trim()]);
        }
      }
    }
    
    return parsed;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setCsvContent([]);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file extension
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseCsv(content);
        
        if (parsed.length === 0) {
          setError("No valid data found in the CSV file. Make sure each line has a front and back separated by a comma.");
          return;
        }
        
        setCsvContent(parsed);
      } catch (err) {
        setError("Failed to parse the CSV file. Please check the format.");
        console.error(err);
      }
    };
    
    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
    };
    
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!selectedDeckId || csvContent.length === 0) return;
    
    const deck = flashcardDecks.find(d => d.id === selectedDeckId);
    if (!deck) return;
    
    // Convert CSV rows to flashcards
    const newCards: Flashcard[] = csvContent.map(([front, back]) => ({
      id: generateId(),
      front,
      back,
      deckId: selectedDeckId,
      lastReviewed: null,
      nextReviewDate: null,
      reviewCount: 0
    }));
    
    // Update deck with new cards
    const updatedDeck: FlashcardDeck = {
      ...deck,
      cards: [...deck.cards, ...newCards]
    };
    
    updateFlashcardDeck(updatedDeck);
    onImportComplete();
  };

  const downloadTemplate = () => {
    const content = "Question,Answer\nWhat is the capital of France?,Paris\nWhat is 2+2?,4";
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcard_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Flashcards</CardTitle>
        <CardDescription>
          Upload a CSV file with questions and answers.
          Each line should have the format: "Question,Answer"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end mb-4">
          <div className="flex-1">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="max-w-md"
            />
          </div>
          <Button variant="outline" onClick={downloadTemplate} size="sm">
            <Download className="h-4 w-4 mr-2" /> Template
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {csvContent.length > 0 && (
          <div className="border rounded-md p-2 max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Front</TableHead>
                  <TableHead>Back</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvContent.map(([front, back], index) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-[150px] truncate">{front}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{back}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleImport} 
            disabled={csvContent.length === 0 || !selectedDeckId}
          >
            <Upload className="h-4 w-4 mr-2" /> 
            Import {csvContent.length} Cards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
