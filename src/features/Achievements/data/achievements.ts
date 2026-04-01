export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  category: string;
}

export const achievements: Achievement[] = [
  // Streak
  { id: "streak-5", title: "Hot Streak", description: "Get 5 correct answers in a row", icon: "\u{1F525}", rarity: "common", points: 10, category: "streak" },
  { id: "streak-10", title: "On Fire", description: "Get 10 correct answers in a row", icon: "\u{1F525}", rarity: "common", points: 20, category: "streak" },
  { id: "streak-25", title: "Unstoppable", description: "Get 25 correct answers in a row", icon: "\u{1F4A5}", rarity: "rare", points: 50, category: "streak" },
  { id: "streak-50", title: "Legendary Streak", description: "Get 50 correct answers in a row", icon: "\u2B50", rarity: "epic", points: 100, category: "streak" },
  { id: "streak-100", title: "Centurion", description: "Get 100 correct answers in a row", icon: "\u{1F451}", rarity: "legendary", points: 200, category: "streak" },

  // Milestone
  { id: "milestone-1", title: "First Steps", description: "Answer your first question correctly", icon: "\u{1F476}", rarity: "common", points: 5, category: "milestone" },
  { id: "milestone-100", title: "Century", description: "Get 100 total correct answers", icon: "\u{1F4AF}", rarity: "common", points: 20, category: "milestone" },
  { id: "milestone-500", title: "Scholar", description: "Get 500 total correct answers", icon: "\u{1F393}", rarity: "rare", points: 50, category: "milestone" },
  { id: "milestone-1000", title: "Master", description: "Get 1,000 total correct answers", icon: "\u{1F3C5}", rarity: "epic", points: 100, category: "milestone" },
  { id: "milestone-5000", title: "Grandmaster", description: "Get 5,000 total correct answers", icon: "\u{1F48E}", rarity: "legendary", points: 250, category: "milestone" },
  { id: "milestone-10000", title: "Legend", description: "Get 10,000 total correct answers", icon: "\u{1F30F}", rarity: "legendary", points: 500, category: "milestone" },

  // Vocabulary Mastery
  { id: "vocab-beginner", title: "Beginner Complete", description: "Master all beginner words", icon: "\u{1F331}", rarity: "rare", points: 50, category: "vocabulary" },
  { id: "vocab-intermediate", title: "Intermediate Complete", description: "Master all intermediate words", icon: "\u{1F4AA}", rarity: "epic", points: 100, category: "vocabulary" },
  { id: "vocab-advanced", title: "Advanced Complete", description: "Master all advanced words", icon: "\u{1F680}", rarity: "legendary", points: 200, category: "vocabulary" },
  { id: "vocab-all-topics", title: "Well-Rounded", description: "Practice every topic at least once", icon: "\u{1F310}", rarity: "rare", points: 50, category: "vocabulary" },

  // Blitz
  { id: "blitz-first", title: "Speed Demon", description: "Complete your first Blitz game", icon: "\u26A1", rarity: "common", points: 10, category: "blitz" },
  { id: "blitz-50", title: "Blitz 50", description: "Score 50+ in a single Blitz", icon: "\u26A1", rarity: "common", points: 20, category: "blitz" },
  { id: "blitz-100", title: "Blitz Master", description: "Score 100+ in a single Blitz", icon: "\u{1F3C3}", rarity: "rare", points: 50, category: "blitz" },
  { id: "blitz-200", title: "Blitz Legend", description: "Score 200+ in a single Blitz", icon: "\u{1F9E0}", rarity: "epic", points: 100, category: "blitz" },
  { id: "blitz-perfect-10", title: "Perfect Ten", description: "Get 10 correct in a row in Blitz", icon: "\u{1F3AF}", rarity: "rare", points: 40, category: "blitz" },
  { id: "blitz-30s", title: "Lightning Round", description: "Complete a 30-second Blitz", icon: "\u26A1", rarity: "common", points: 10, category: "blitz" },
  { id: "blitz-120s", title: "Marathon Sprinter", description: "Complete a 120-second Blitz", icon: "\u{1F3C3}", rarity: "common", points: 15, category: "blitz" },

  // Gauntlet
  { id: "gauntlet-first", title: "Challenger", description: "Complete your first Gauntlet", icon: "\u{1F525}", rarity: "common", points: 10, category: "gauntlet" },
  { id: "gauntlet-normal", title: "Survivor", description: "Complete a Normal Gauntlet", icon: "\u{1F49A}", rarity: "rare", points: 50, category: "gauntlet" },
  { id: "gauntlet-hard", title: "Tough Cookie", description: "Complete a Hard Gauntlet", icon: "\u{1F9E1}", rarity: "epic", points: 100, category: "gauntlet" },
  { id: "gauntlet-instant", title: "Deathless", description: "Complete an Instant Death Gauntlet", icon: "\u{1F480}", rarity: "legendary", points: 250, category: "gauntlet" },
  { id: "gauntlet-10x", title: "Gauntlet Veteran", description: "Complete 10 Gauntlets", icon: "\u{1F396}\uFE0F", rarity: "rare", points: 60, category: "gauntlet" },
  { id: "gauntlet-flawless", title: "Flawless Victory", description: "Complete a Gauntlet with zero mistakes", icon: "\u{1F947}", rarity: "legendary", points: 300, category: "gauntlet" },

  // Speed
  { id: "speed-1s", title: "Quick Draw", description: "Answer correctly in under 1 second", icon: "\u{1F4A8}", rarity: "rare", points: 30, category: "speed" },
  { id: "speed-2s", title: "Fast Fingers", description: "Answer correctly in under 2 seconds", icon: "\u{1F3CE}\uFE0F", rarity: "common", points: 15, category: "speed" },
  { id: "speed-avg-3s", title: "Consistent Speed", description: "Average under 3s per answer in a full session", icon: "\u23F1\uFE0F", rarity: "rare", points: 40, category: "speed" },

  // Consistency
  { id: "daily-3", title: "Three-Day Streak", description: "Train for 3 days in a row", icon: "\u{1F4C5}", rarity: "common", points: 15, category: "consistency" },
  { id: "daily-7", title: "Weekly Warrior", description: "Train for 7 days in a row", icon: "\u{1F4C6}", rarity: "rare", points: 30, category: "consistency" },
  { id: "daily-14", title: "Fortnight Fighter", description: "Train for 14 days in a row", icon: "\u{1F4AA}", rarity: "rare", points: 50, category: "consistency" },
  { id: "daily-30", title: "Monthly Master", description: "Train for 30 days in a row", icon: "\u{1F3C6}", rarity: "epic", points: 100, category: "consistency" },
  { id: "daily-100", title: "Centurial Scholar", description: "Train for 100 days in a row", icon: "\u{1F451}", rarity: "legendary", points: 300, category: "consistency" },
  { id: "total-days-10", title: "Regular", description: "Train on 10 different days", icon: "\u{1F4C5}", rarity: "common", points: 15, category: "consistency" },
  { id: "total-days-50", title: "Dedicated", description: "Train on 50 different days", icon: "\u{1F4C5}", rarity: "rare", points: 40, category: "consistency" },

  // Exploration
  { id: "explore-all-modes", title: "Explorer", description: "Try every game mode", icon: "\u{1F9ED}", rarity: "rare", points: 30, category: "exploration" },
  { id: "explore-pick", title: "Picker", description: "Complete a game in Pick mode", icon: "\u{1F446}", rarity: "common", points: 5, category: "exploration" },
  { id: "explore-input", title: "Typist", description: "Complete a game in Input mode", icon: "\u2328\uFE0F", rarity: "common", points: 5, category: "exploration" },
  { id: "explore-all-levels", title: "Level Complete", description: "Play all three difficulty levels", icon: "\u{1F4CA}", rarity: "rare", points: 30, category: "exploration" },

  // Fun / Secret
  { id: "fun-wrong-5", title: "Oops", description: "Get 5 wrong answers in a row", icon: "\u{1F605}", rarity: "common", points: 5, category: "fun" },
  { id: "fun-wrong-10", title: "Persistence", description: "Get 10 wrong answers in a row", icon: "\u{1F62D}", rarity: "rare", points: 10, category: "fun" },
  { id: "fun-session-1", title: "Just One More", description: "Play 5 sessions in one day", icon: "\u{1F504}", rarity: "common", points: 10, category: "fun" },
  { id: "fun-night-owl", title: "Night Owl", description: "Practice after midnight", icon: "\u{1F989}", rarity: "rare", points: 20, category: "fun" },
  { id: "fun-early-bird", title: "Early Bird", description: "Practice before 6 AM", icon: "\u{1F426}", rarity: "rare", points: 20, category: "fun" },
  { id: "fun-perfect-session", title: "Perfectionist", description: "Complete a session with 100% accuracy", icon: "\u2728", rarity: "rare", points: 40, category: "fun" },
  { id: "fun-50-50", title: "Coin Flip", description: "Finish a session with exactly 50% accuracy", icon: "\u{1FA99}", rarity: "rare", points: 15, category: "fun" },

  // Sessions
  { id: "sessions-5", title: "Getting Started", description: "Complete 5 learning sessions", icon: "\u{1F4D6}", rarity: "common", points: 10, category: "milestone" },
  { id: "sessions-25", title: "Bookworm", description: "Complete 25 learning sessions", icon: "\u{1F4DA}", rarity: "rare", points: 30, category: "milestone" },
  { id: "sessions-100", title: "Veteran", description: "Complete 100 learning sessions", icon: "\u{1F3C5}", rarity: "epic", points: 75, category: "milestone" },
  { id: "sessions-500", title: "Sage", description: "Complete 500 learning sessions", icon: "\u{1F9D9}", rarity: "legendary", points: 200, category: "milestone" },

  // Accuracy
  { id: "accuracy-90", title: "Sharp Mind", description: "Maintain 90%+ accuracy over 50+ answers", icon: "\u{1F9E0}", rarity: "rare", points: 40, category: "milestone" },
  { id: "accuracy-95", title: "Genius", description: "Maintain 95%+ accuracy over 100+ answers", icon: "\u{1F4A1}", rarity: "epic", points: 80, category: "milestone" },

  // Topic-specific
  { id: "topic-idioms", title: "Idiom Expert", description: "Master all idioms", icon: "\u{1F4AC}", rarity: "epic", points: 75, category: "vocabulary" },
  { id: "topic-phrasal", title: "Phrasal Pro", description: "Master all phrasal verbs", icon: "\u{1F517}", rarity: "epic", points: 75, category: "vocabulary" },
  { id: "topic-business", title: "Business Ready", description: "Master all business vocabulary", icon: "\u{1F4BC}", rarity: "epic", points: 75, category: "vocabulary" },
  { id: "topic-literary", title: "Wordsmith", description: "Master all literary vocabulary", icon: "\u{1F4DD}", rarity: "epic", points: 75, category: "vocabulary" },
  { id: "topic-food", title: "Foodie", description: "Master all food & drink vocabulary", icon: "\u{1F354}", rarity: "rare", points: 40, category: "vocabulary" },
  { id: "topic-greetings", title: "Social Butterfly", description: "Master all greetings vocabulary", icon: "\u{1F44B}", rarity: "rare", points: 40, category: "vocabulary" },

  // Special
  { id: "special-first-day", title: "Welcome!", description: "Start your eng-kudo journey", icon: "\u{1F389}", rarity: "common", points: 5, category: "milestone" },
  { id: "special-comeback", title: "Comeback Kid", description: "Return after 7+ days away", icon: "\u{1F44B}", rarity: "rare", points: 25, category: "fun" },
];
