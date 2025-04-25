
import { AppData } from "../types";

export const appData: AppData = {
  "app": {
    "name": "Scholar's Chronicle",
    "description": "A comprehensive study tracking and progress management system"
  },
  "subjects": {
    "physics": {
      "name": "Physics",
      "icon": "Atom",
      "color": "blue",
      "units": {
        "unit4": {
          "name": "Unit 4",
          "topics": [
            "Mechanics and materials (stress-strain, Young modulus)",
            "Waves (superposition, diffraction, interference)",
            "Stationary waves (resonance)",
            "Electric circuits (advanced applications)"
          ]
        },
        "unit5": {
          "name": "Unit 5",
          "topics": [
            "Circular motion and Simple Harmonic Motion",
            "Electric, magnetic and gravitational fields",
            "Capacitance and energy storage",
            "Electromagnetic induction",
            "Alternating current circuits",
            "Particle physics and quantum phenomena"
          ]
        },
        "unit6": {
          "name": "Unit 6",
          "topics": [
            "Planning scientific investigations",
            "Measurement techniques and uncertainty analysis",
            "Data analysis and error propagation",
            "Evaluation of experimental methods",
            "Practical skills assessment"
          ]
        }
      }
    },
    "mathematics": {
      "name": "Mathematics",
      "icon": "PiSquare",
      "color": "green",
      "units": {
        "unit3": {
          "name": "Unit 3",
          "topics": [
            "Algebra and functions (laws of indices, surds, quadratics)",
            "Coordinate geometry (straight lines, circles)",
            "Sequences and series (arithmetic, geometric)",
            "Differentiation (chain, product, quotient rules)",
            "Integration (substitution, parts, partial fractions)",
            "Numerical methods (root finding, integration)"
          ]
        },
        "unit4": {
          "name": "Unit 4",
          "topics": [
            "Proof techniques",
            "Binomial expansion for rational indices",
            "Complex numbers (polar form, operations)",
            "Matrices (operations, transformations)",
            "Taylor and Maclaurin series",
            "Advanced differential equations",
            "Vectors (3D operations, vector equations)"
          ]
        },
        "decision1": {
          "name": "Decision 1",
          "topics": [
            "Algorithms",
            "Graphs and networks",
            "Algorithms on networks",
            "Route inspection (Chinese postman problem)",
            "Critical path analysis",
            "Linear programming",
            "Matchings"
          ]
        }
      }
    },
    "computerScience": {
      "name": "Computer Science",
      "icon": "Code",
      "color": "purple",
      "units": {
        "paper3": {
          "name": "Paper 3",
          "topics": [
            "Data representation (binary, hexadecimal)",
            "Communication and networking (protocols, security)",
            "Hardware architecture (CPU, memory systems)",
            "System software and development lifecycle",
            "Security and ethics in computing",
            "Emerging technologies and innovations"
          ]
        },
        "paper4": {
          "name": "Paper 4",
          "topics": [
            "Programming paradigms (object-oriented, functional)",
            "Abstract data types and data structures",
            "Algorithm design, efficiency and trace tables",
            "Testing methodologies and implementation",
            "Documentation and evaluation techniques"
          ]
        }
      }
    }
  },
  "character": {
    "defaultStats": {
      "wisdom": 1,
      "focus": 1,
      "memory": 1,
      "discipline": 1
    },
    "levelingSystem": {
      "baseXP": 100,
      "multiplier": 1.5,
      "maxLevel": 50
    }
  },
  "quests": {
    "types": ["learning", "practice", "revision", "assessment"],
    "difficulties": ["beginner", "intermediate", "advanced", "expert"],
    "defaultXPRewards": {
      "beginner": 50,
      "intermediate": 75,
      "advanced": 100,
      "expert": 150
    }
  },
  "examSchedule": {
    "physics": [
      {
        "date": "2025-05-29",
        "time": "11:30 - 13:15",
        "paper": "Physics Unit 4",
        "code": "WPH14 01"
      },
      {
        "date": "2025-06-04",
        "time": "08:30 - 10:15",
        "paper": "Physics Unit 5",
        "code": "WPH15 01"
      },
      {
        "date": "2025-06-09",
        "time": "09:00 - 10:20",
        "paper": "Physics Unit 6 (Practical)",
        "code": "WPH16 01"
      }
    ],
    "mathematics": [
      {
        "date": "2025-05-15",
        "time": "11:30 - 13:00",
        "paper": "Maths D1: Decision 1",
        "code": "WDM11 01"
      },
      {
        "date": "2025-05-29",
        "time": "09:00 - 10:30",
        "paper": "Maths P3: Pure 3",
        "code": "WMA13 01"
      },
      {
        "date": "2025-06-05",
        "time": "11:30 - 13:00",
        "paper": "Maths P4: Pure 4",
        "code": "WMA14 01"
      }
    ],
    "computerScience": [
      {
        "date": "2025-05-21",
        "time": "11:30 - 13:00",
        "paper": "Comp Sci Paper 3 (Advanced Theory)",
        "code": "9618 32"
      },
      {
        "date": "2025-05-23",
        "time": "09:00 - 11:30",
        "paper": "Comp Sci Paper 4 (Practical)",
        "code": "9618 42"
      }
    ]
  },
  "studyTools": {
    "timer": {
      "presets": [
        {"name": "Pomodoro", "duration": 25},
        {"name": "Extended Focus", "duration": 45},
        {"name": "Deep Work", "duration": 60},
        {"name": "Long Session", "duration": 120}
      ],
      "breakDurations": {
        "short": 5,
        "long": 15
      }
    },
    "flashcards": {
      "maxCardsPerDeck": 100,
      "reviewIntervals": [1, 3, 7, 14, 30]
    }
  },
  "storage": {
    "localStorageKeys": {
      "character": "scholar-character",
      "quests": "scholar-quests",
      "flashcards": "scholar-flashcards",
      "errorLog": "scholar-error-log",
      "timerSessions": "scholar-timer-sessions",
      "authentication": "scholar-auth",
      "theme": "scholar-theme"
    }
  }
};
