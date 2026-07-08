"use client";

import React, { useState } from "react";
import { calculateMatchScore } from "@/lib/match-engine/tfidf-scorer";

export default function MatchPage() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const handleMatch = () => {
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
