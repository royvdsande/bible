"use client";

import { useEffect, useState } from "react";
import { getTotaalVoltooid, getVoortgang } from "@/lib/storage";
import { LEESPLAN } from "@/lib/bibleData";

const TOTAL_DAYS = LEESPLAN.length;

export default function ProgressBar() {
  const [voltooid, setVoltooid] = useState(0);
  const [completedDays, setCompletedDays] = useState<boolean[]>([]);

  useEffect(() => {
    const totaal = getTotaalVoltooid();
    setVoltooid(totaal);

    const voortgang = getVoortgang();
    const days = LEESPLAN.map((dag) => voortgang[dag.id]?.voltooid ?? false);
    setCompletedDays(days);
  }, []);

  const percentage = Math.round((voltooid / TOTAL_DAYS) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-2">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
          Voortgang
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: "#D4A853" }}
        >
          {voltooid} van {TOTAL_DAYS} dagen voltooid
        </span>
      </div>

      {/* Progress bar track */}
      <div className="progress-track h-2 w-full mb-4">
        <div
          className="progress-fill h-2"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Day dots */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {LEESPLAN.map((dag, index) => {
          const done = completedDays[index] ?? false;
          return (
            <div
              key={dag.id}
              title={`Dag ${dag.id}: ${dag.titel}`}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: "10px",
                  height: "10px",
                  background: done
                    ? "#D4A853"
                    : "#222",
                  border: done
                    ? "1px solid rgba(212,168,83,0.4)"
                    : "1px solid #333",
                  boxShadow: done
                    ? "0 0 8px rgba(212,168,83,0.6)"
                    : "none",
                }}
              />
              <span
                className="text-[10px]"
                style={{ color: done ? "#D4A853" : "#444" }}
              >
                {dag.id}
              </span>
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {voltooid === TOTAL_DAYS && (
        <p
          className="text-center mt-4 text-sm font-medium animate-fade-in-up"
          style={{ color: "#D4A853" }}
        >
          Geweldig! Je hebt het volledige leesplan afgerond.
        </p>
      )}
    </div>
  );
}
