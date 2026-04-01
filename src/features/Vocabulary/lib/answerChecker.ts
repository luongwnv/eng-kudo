import type { GameMode } from "@/shared/types";

/** Check if user answer matches the correct answer */
export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  mode: GameMode,
): boolean {
  if (mode === "pick") {
    return userAnswer === correctAnswer;
  }

  // Input mode: fuzzy matching
  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");

  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  if (user === correct) return true;

  // Allow partial match for long definitions
  if (correct.length > 20 && user.length > 5) {
    const words = correct.split(" ");
    const userWords = user.split(" ");
    const matchCount = userWords.filter((w) => words.includes(w)).length;
    return matchCount / words.length >= 0.6;
  }

  // Levenshtein distance for short answers (allow 1-2 typos)
  const dist = levenshtein(user, correct);
  const maxDist = correct.length <= 5 ? 1 : 2;
  return dist <= maxDist;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[m][n];
}
