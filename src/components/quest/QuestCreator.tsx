
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { appData } from "@/data/appData";
import { Quest, QuestType, QuestDifficulty } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

export default function QuestCreator() {
  const { addQuest } = useApp();
  
  // Form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subject, setSubject] = useState<string>("physics");
  const [unit, setUnit] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [type, setType] = useState<QuestType>("learning");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("beginner");
  
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
    
    const unitName = unitId;
    const unitEntry = Object.entries(subject.units).find(([_, unit]) => unit.name === unitName);
    
    if (!unitEntry) return [];
    return unitEntry[1].topics;
  };
  
  const handleCreateQuest = () => {
    if (!title || !description || !subject || !unit || !topic || !type || !difficulty) {
      toast("Missing information", {
        description: "Please fill out all fields to create a quest.",
      });
      return;
    }
    
    // Get XP reward for the selected difficulty
    const xpReward = appData.quests.defaultXPRewards[difficulty];
    
    const newQuest: Omit<Quest, "id" | "completed"> = {
      title,
      description,
      subject,
      unit,
      topic,
      type,
      difficulty,
      xpReward
    };
    
    addQuest(newQuest);
    
    toast("Quest created", {
      description: `${title} has been added to your active quests.`,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setTopic("");
  };
  
  const handleSubjectChange = (value: string) => {
    setSubject(value);
    setUnit("");
    setTopic("");
  };
  
  const handleUnitChange = (value: string) => {
    setUnit(value);
    setTopic("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Quest</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Quest Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master Newton's Laws"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need to accomplish"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Select 
                value={subject}
                onValueChange={handleSubjectChange}
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
                value={unit}
                onValueChange={handleUnitChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {getUnitsForSubject(subject).map((unit) => (
                    <SelectItem key={unit.id} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Topic</label>
            <Select
              value={topic}
              onValueChange={setTopic}
              disabled={!unit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {getTopicsForSubjectAndUnit(subject, unit).map((topic, index) => (
                  <SelectItem key={index} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quest Type</label>
              <Select value={type} onValueChange={(value) => setType(value as QuestType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appData.quests.types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as QuestDifficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appData.quests.difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)} (+{appData.quests.defaultXPRewards[diff as QuestDifficulty]} XP)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            type="button"
            onClick={handleCreateQuest}
          >
            Create Quest
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
