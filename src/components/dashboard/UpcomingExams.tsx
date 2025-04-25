
import { appData } from "@/data/appData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { formatDate, daysUntil } from "@/utils/helpers";

export default function UpcomingExams() {
  // Get all exams
  const allExams = [
    ...appData.examSchedule.physics,
    ...appData.examSchedule.mathematics,
    ...appData.examSchedule.computerScience,
  ];
  
  // Sort exams by date (closest first)
  const sortedExams = allExams
    .filter(exam => daysUntil(exam.date) >= 0)
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .slice(0, 5); // Show max 5 upcoming exams

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Upcoming Exams</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedExams.length > 0 ? (
          <div className="space-y-4">
            {sortedExams.map((exam, index) => {
              const days = daysUntil(exam.date);
              
              return (
                <div 
                  key={`${exam.code}-${index}`} 
                  className="flex items-start justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <h4 className="font-medium">{exam.paper}</h4>
                    <p className="text-gray-500 text-sm">
                      {formatDate(exam.date)} • {exam.time}
                    </p>
                    <p className="text-xs text-gray-400">Code: {exam.code}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">
                      {days === 0 ? (
                        <span className="text-red-500">Today!</span>
                      ) : (
                        <span className={days <= 7 ? "text-amber-500" : "text-gray-500"}>
                          {days} days
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No upcoming exams found
          </p>
        )}
      </CardContent>
    </Card>
  );
}
