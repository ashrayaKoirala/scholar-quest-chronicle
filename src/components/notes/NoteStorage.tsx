
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { File, FilePlus, FileX, ExternalLink } from "lucide-react";
import { appData } from "@/data/appData";

interface Note {
  id: string;
  title: string;
  subject: string;
  topic: string;
  url: string;
  dateAdded: string;
}

// Load notes from localStorage
const loadNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem('scholar-notes');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading notes", e);
    return [];
  }
};

// Save notes to localStorage
const saveNotes = (notes: Note[]) => {
  try {
    localStorage.setItem('scholar-notes', JSON.stringify(notes));
  } catch (e) {
    console.error("Error saving notes", e);
  }
};

export default function NoteStorage() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subject, setSubject] = useState<string>("physics");
  const [topic, setTopic] = useState<string>("");

  const subjects = Object.entries(appData.subjects);
  
  const getTopicsForSubject = (subjectId: string): string[] => {
    const selectedSubject = appData.subjects[subjectId as keyof typeof appData.subjects];
    if (!selectedSubject) return [];
    
    // Flatten all topics from all units
    return Object.values(selectedSubject.units).flatMap(unit => unit.topics);
  };
  
  const validateGoogleDriveUrl = (url: string): boolean => {
    // Simple validation for Google Drive links
    return url.includes("drive.google.com");
  };
  
  const handleAddNote = () => {
    if (!title || !url || !subject || !topic) {
      toast("Missing information", {
        description: "Please fill out all fields to add a note.",
      });
      return;
    }
    
    if (!validateGoogleDriveUrl(url)) {
      toast("Invalid URL", {
        description: "Please enter a valid Google Drive URL.",
      });
      return;
    }
    
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      subject,
      topic,
      url,
      dateAdded: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    
    // Reset form
    setTitle("");
    setUrl("");
    setTopic("");
    
    toast("Note added", {
      description: `${title} has been added to your notes.`,
    });
  };
  
  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    
    toast("Note removed", {
      description: "The selected note has been removed.",
    });
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  const getSubjectName = (subjectId: string): string => {
    const subject = appData.subjects[subjectId as keyof typeof appData.subjects];
    return subject ? subject.name : subjectId;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Study Notes</CardTitle>
          <CardDescription>
            Store links to your Google Drive study materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Note Title</Label>
                <Input 
                  id="title" 
                  placeholder="Chemistry Revision Notes" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Google Drive URL</Label>
                <Input 
                  id="url" 
                  placeholder="https://drive.google.com/..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={subject}
                  onValueChange={(value) => {
                    setSubject(value);
                    setTopic("");
                  }}
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
              
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select
                  value={topic}
                  onValueChange={setTopic}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTopicsForSubject(subject).map((topic, index) => (
                      <SelectItem key={index} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddNote}>
            <FilePlus className="mr-2 h-4 w-4" /> Add Note
          </Button>
        </CardFooter>
      </Card>
      
      {notes.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>My Study Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">{note.title}</TableCell>
                    <TableCell>{getSubjectName(note.subject)}</TableCell>
                    <TableCell>{note.topic}</TableCell>
                    <TableCell>{formatDate(note.dateAdded)}</TableCell>
                    <TableCell className="flex justify-end space-x-2">
                      <Button size="icon" variant="ghost" asChild>
                        <a href={note.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <FileX className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <File className="h-10 w-10 text-gray-400 mb-4" />
            <h3 className="font-medium text-lg">No notes yet</h3>
            <p className="text-sm text-gray-500 mt-2">
              Add your Google Drive notes above to keep track of your study materials.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
