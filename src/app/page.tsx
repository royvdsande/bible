"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProgressBar from "@/components/ProgressBar";
import DayCard from "@/components/DayCard";
import { LEESPLAN } from "@/lib/bibleData";
import { getVoortgang } from "@/lib/storage";

function getCurrentDayId(): number {
  // Determine the "current" day: first uncompleted day, or last day if all done
  if (typeof window === "undefined") return 1;
  const voortgang = getVoortgang();
  for (const dag of LEESPLAN) {
    if (!voortgang[dag.id]?.voltooid) {
      return dag.id;
    }
  }
  return LEESPLAN[LEESPLAN.length - 1].id;
}

export default function HomePage() {
  const [todayId, setTodayId] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTodayId(getCurrentDayId());
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Hero with cross */}
      <HeroSection />

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        {/* Progress section */}
        <section className="mb-10 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <ProgressBar />
        </section>

        {/* Section heading */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: "3px",
                height: "20px",
                background: "linear-gradient(180deg, #D4A853, rgba(212,168,83,0.2))",
                borderRadius: "2px",
              }}
            />
            <h2
              className="font-serif text-xl font-semibold"
              style={{ color: "#F0EDE8" }}
            >
              7-Daags Leesplan
            </h2>
          </div>
          <p
            className="text-sm mt-1 ml-5"
            style={{ color: "#6B7280" }}
          >
            Klik op een dag om te beginnen met lezen
          </p>
        </div>

        {/* Days grid */}
        {mounted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEESPLAN.map((dag, index) => (
              <div
                key={dag.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${350 + index * 60}ms`,
                  animationFillMode: "both",
                }}
              >
                <DayCard dag={dag} isToday={dag.id === todayId} />
              </div>
            ))}
          </div>
        ) : (
          // SSR placeholder skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl h-32 skeleton"
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-14 pt-6 text-center animate-fade-in-up"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            animationDelay: "800ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-xs" style={{ color: "#374151" }}>
            Bijbel Leesplan · Gods Woord voor elke dag
          </p>
        </div>
      </div>
    </main>
  );
}
