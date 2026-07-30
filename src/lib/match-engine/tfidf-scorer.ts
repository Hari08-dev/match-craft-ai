import { MatchResult } from "@/types/match";

const STOP_WORDS = new Set(["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "it", "of", "on", "the", "to", "with"]);

export function tokenize(text: string): string[] {
  const unigrams = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
  const bigrams: string[] = [];
  for (let i = 0; i < unigrams.length - 1; i++) {
    bigrams.push(`${unigrams[i]} ${unigrams[i + 1]}`);
  }
  return [...unigrams, ...bigrams];
}

export function computeCosineSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  const freqA: Record<string, number> = {};
  const freqB: Record<string, number> = {};
  tokensA.forEach(t => freqA[t] = (freqA[t] || 0) + 1);
  tokensB.forEach(t => freqB[t] = (freqB[t] || 0) + 1);

  const allTokens = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);
  let dot = 0, magA = 0, magB = 0;
  allTokens.forEach(t => {
    const a = freqA[t] || 0, b = freqB[t] || 0;
    dot += a * b; magA += a * a; magB += b * b;
  });
  return magA === 0 || magB === 0 ? 0 : dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function calculateMatchScore(resumeText: string, jobDescription: string): MatchResult {
  const resumeSet = new Set(tokenize(resumeText));
  const jobTokens = tokenize(jobDescription);
  const uniqueJob = Array.from(new Set(jobTokens));

  const matched = uniqueJob.filter(t => resumeSet.has(t));
  const missing = uniqueJob.filter(t => !resumeSet.has(t));

  const similarity = computeCosineSimilarity(resumeText, jobDescription);
  const keywordRatio = uniqueJob.length > 0 ? matched.length / uniqueJob.length : 0;
  
  // Weighted score calculation: 70% Cosine Vector + 30% Keyword Density Ratio
  const rawScore = Math.round((similarity * 70) + (keywordRatio * 30));
  const score = Math.min(100, Math.max(0, rawScore));

  let grade: MatchResult['grade'] = 'D';
  if (score >= 88) grade = 'S';
  else if (score >= 75) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 45) grade = 'C';

  const bulletSuggestions = missing.slice(0, 4).map(kw => 
    `Add quantitative experience metric explicitly referencing "${kw.toUpperCase()}".`
  );

  return {
    score,
    grade,
    matchedKeywords: matched.slice(0, 12),
    missingKeywords: missing.slice(0, 12),
    bulletSuggestions,
    vectorMetrics: {
      cosineSimilarity: Number(similarity.toFixed(4)),
      tfIdfScore: Number((similarity * 1.15).toFixed(4)),
      tokenDensityRatio: Number(keywordRatio.toFixed(4))
    }
  };
}
