
import { ExamInfo } from "@/types";
import { formatDate, daysUntil, isExamToday } from "@/utils/helpers";

interface ExamScheduleTableProps {
  subject: string;
  exams: ExamInfo[];
}

export default function ExamScheduleTable({ subject, exams }: ExamScheduleTableProps) {
  // Get subject color
  const getSubjectColor = (subject: string): string => {
    switch (subject.toLowerCase()) {
      case "physics":
        return "border-physics text-physics";
      case "mathematics":
        return "border-mathematics text-mathematics";
      case "computerscience":
        return "border-computerScience text-computerScience";
      default:
        return "border-primary text-primary";
    }
  };
  
  const subjectColor = getSubjectColor(subject);
  
  return (
    <div className="rounded-lg bg-white shadow-sm border overflow-hidden">
      <div className={`py-3 px-4 font-medium border-l-4 ${subjectColor}`}>
        {subject}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Paper</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Code</th>
              <th className="py-3 px-4 text-right">Days Left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.map((exam, index) => {
              const days = daysUntil(exam.date);
              const isToday = isExamToday(exam.date);
              const isPast = days < 0;
              
              return (
                <tr 
                  key={index} 
                  className={`
                    ${isToday ? "bg-amber-50" : ""} 
                    ${isPast ? "text-gray-400" : ""}
                  `}
                >
                  <td className="py-3 px-4">{exam.paper}</td>
                  <td className="py-3 px-4">{formatDate(exam.date)}</td>
                  <td className="py-3 px-4">{exam.time}</td>
                  <td className="py-3 px-4 font-mono text-xs">{exam.code}</td>
                  <td className="py-3 px-4 text-right">
                    {isPast ? (
                      <span className="inline-block bg-gray-100 text-gray-500 rounded px-2 py-1 text-xs">
                        Past
                      </span>
                    ) : isToday ? (
                      <span className="inline-block bg-red-100 text-red-600 rounded px-2 py-1 text-xs">
                        Today!
                      </span>
                    ) : (
                      <span className={`
                        inline-block rounded px-2 py-1 text-xs
                        ${days <= 7 ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-700"}
                      `}>
                        {days} days
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
