// Initial basic matcher prototype
export function calculateMatchScore(resumeText: string, jobDescription: string) {
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const jobWords = jobDescription.toLowerCase().split(/\s+/);

  let count = 0;
  const matched: string[] = [];

  jobWords.forEach(word => {
    if (word.length > 3 && resumeWords.includes(word)) {
      count++;
      if (!matched.includes(word)) matched.push(word);
    }
  });

  const score = Math.min(100, Math.round((count / Math.max(1, jobWords.length)) * 100));
  return { score, grade: score > 70 ? 'A' : 'B', matchedKeywords: matched };
}
