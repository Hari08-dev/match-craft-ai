export interface MatchResult {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  matchedKeywords: string[];
  missingKeywords: string[];
  vectorMetrics: {
    cosineSimilarity: number;
    tfIdfScore: number;
  };
}
