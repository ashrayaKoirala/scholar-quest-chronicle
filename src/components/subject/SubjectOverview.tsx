
import { useState } from "react";
import { appData } from "@/data/appData";
import { Subject } from "@/types";
import { Atom, Code, PiSquare } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubjectOverviewProps {
  subjectId: string;
}

export default function SubjectOverview({ subjectId }: SubjectOverviewProps) {
  const subject = appData.subjects[subjectId as keyof typeof appData.subjects];
  
  if (!subject) {
    return (
      <div className="p-8 text-center">
        <p>Subject not found</p>
      </div>
    );
  }
  
  // Get the correct icon component
  const IconComponent = (() => {
    switch (subject.icon) {
      case "Atom":
        return Atom;
      case "PiSquare":
        return PiSquare;
      case "Code":
        return Code;
      default:
        return Atom;
    }
  })();
  
  // Get the correct color class
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "text-physics";
      case "green":
        return "text-mathematics";
      case "purple":
        return "text-computerScience";
      default:
        return "text-primary";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className={getColorClass(subject.color)} />
            <span>{subject.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Explore the units and topics for {subject.name} below.
          </p>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Units</h3>
        
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(subject.units).map(([unitId, unit], index) => (
            <AccordionItem key={unitId} value={unitId}>
              <AccordionTrigger className="py-4 px-6 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                {unit.name}
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-gray-50 rounded-b-lg">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Topics:</h4>
                  <ul className="space-y-2">
                    {unit.topics.map((topic, i) => (
                      <li 
                        key={i} 
                        className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
