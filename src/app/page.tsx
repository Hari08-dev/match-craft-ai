"use client";

import React, { useState } from "react";
import { calculateMatchScore } from "@/lib/match-engine/tfidf-scorer";
import { MatchRequestSchema } from "@/lib/zod-schemas";

export default function MatchPage() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = () => {
    setError(null);
    const parsed = MatchRequestSchema.safeParse({ resumeText: resume, jobDescription: job });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Invalid input");
      return;
    }
    const res = calculateMatchScore(resume, job);
    setScore(res.score);
  };

  return (
    <main className="p-8">
      <h1>MatchCraft AI</h1>
      <textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Resume" />
      <textarea value={job} onChange={(e) => setJob(e.target.value)} placeholder="Job Description" />
      <button onClick={handleMatch}>Match</button>
      {score !== null && <div>Score: {score}%</div>}
    </main>
  );
}
