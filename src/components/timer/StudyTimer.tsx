
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { appData } from "@/data/appData";
import { Pause, Play, RotateCcw, Forward } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useApp } from "@/context/AppContext";

export enum TimerStatus {
  IDLE = "idle",
  RUNNING = "running",
  PAUSED = "paused",
  BREAK = "break"
}

export default function StudyTimer() {
  const { addCharacterXP } = useApp();
  
  // Max hours in minutes (4 hours = 240 minutes)
  const maxMinutes = 240;
  
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(selectedMinutes * 60);
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(appData.studyTools.timer.breakDurations.short * 60);
  const timer = useRef<number | null>(null);

  // Update time remaining when duration changes
  useEffect(() => {
    if (status === TimerStatus.IDLE) {
      setTimeRemaining(selectedMinutes * 60);
    }
  }, [selectedMinutes, status]);

  // Handle timer ticking
  useEffect(() => {
    if (status === TimerStatus.RUNNING || status === TimerStatus.BREAK) {
      timer.current = window.setInterval(() => {
        if (status === TimerStatus.RUNNING) {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timer.current!);
              onTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        } else if (status === TimerStatus.BREAK) {
          setBreakTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timer.current!);
              onBreakComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [status]);

  const startTimer = () => {
    setStatus(TimerStatus.RUNNING);
  };

  const pauseTimer = () => {
    setStatus(TimerStatus.PAUSED);
  };

  const resetTimer = () => {
    setStatus(TimerStatus.IDLE);
    setTimeRemaining(selectedMinutes * 60);
    setBreakTimeRemaining(appData.studyTools.timer.breakDurations.short * 60);
  };

  const skipToBreak = () => {
    onTimerComplete();
  };

  const onTimerComplete = () => {
    // Award XP based on duration
    const xpGained = Math.ceil(selectedMinutes / 5);
    addCharacterXP(xpGained);
    
    toast("Study session completed", {
      description: `Great work! You've earned ${xpGained} XP. Time for a break.`,
    });
    
    // Start break
    setStatus(TimerStatus.BREAK);
    setBreakTimeRemaining(appData.studyTools.timer.breakDurations.short * 60);
  };

  const onBreakComplete = () => {
    toast("Break time over", {
      description: "Ready for another study session?",
    });
    resetTimer();
  };

  const handleSliderChange = (value: number[]) => {
    setSelectedMinutes(value[0]);
  };

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format minutes for display
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    
    return `${mins} minutes`;
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (status === TimerStatus.BREAK) {
      const totalBreakTime = appData.studyTools.timer.breakDurations.short * 60;
      return ((totalBreakTime - breakTimeRemaining) / totalBreakTime) * 100;
    } else {
      const totalTime = selectedMinutes * 60;
      return ((totalTime - timeRemaining) / totalTime) * 100;
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Study Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="text-6xl font-mono font-bold">
            {status === TimerStatus.BREAK 
              ? formatTime(breakTimeRemaining) 
              : formatTime(timeRemaining)}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="progress-bar h-3">
            <div 
              className={`h-full transition-all duration-300 ${
                status === TimerStatus.BREAK ? "bg-blue-400" : "bg-primary"
              }`}
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-2">
            {status === TimerStatus.BREAK 
              ? "Break time" 
              : status === TimerStatus.RUNNING
                ? "Studying..."
                : "Ready to study"}
          </p>
        </div>
        
        {status === TimerStatus.IDLE && (
          <div className="space-y-6 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Study Duration: {formatDuration(selectedMinutes)}</span>
                <span className="text-xs text-gray-500">Max: {formatDuration(maxMinutes)}</span>
              </div>
              <Slider 
                defaultValue={[selectedMinutes]} 
                max={maxMinutes}
                min={5}
                step={5}
                onValueChange={handleSliderChange}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {appData.studyTools.timer.presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMinutes(preset.duration)}
                  className={selectedMinutes === preset.duration ? "bg-primary/10" : ""}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-center gap-3">
          {status === TimerStatus.IDLE && (
            <Button onClick={startTimer}>
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
          )}
          
          {status === TimerStatus.RUNNING && (
            <>
              <Button variant="outline" onClick={pauseTimer}>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
              <Button variant="outline" onClick={resetTimer}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button variant="outline" onClick={skipToBreak}>
                <Forward className="mr-2 h-4 w-4" /> Skip
              </Button>
            </>
          )}
          
          {status === TimerStatus.PAUSED && (
            <>
              <Button onClick={startTimer}>
                <Play className="mr-2 h-4 w-4" /> Resume
              </Button>
              <Button variant="outline" onClick={resetTimer}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </>
          )}
          
          {status === TimerStatus.BREAK && (
            <Button variant="outline" onClick={resetTimer}>
              <RotateCcw className="mr-2 h-4 w-4" /> End Break
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
