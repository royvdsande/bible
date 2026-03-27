"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LEESPLAN } from "@/lib/bibleData";
import type { AIContent, BijbelDag } from "@/lib/types";
import {
  getDagVoortgang,
  setDagVoltooid,
  saveAIContent,
  getAIContent,
} from "@/lib/storage";
import AIContentDisplay from "@/components/AIContentDisplay";
import Notes from "@/components/Notes";
import Cross from "@/components/Cross";

interface ReadingPageProps {
  params: { id: string };
}

// Resolve thema accent color for the badge
function getThemaColor(thema: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    Begin: { bg: "rgba(212,168,83,0.12)", text: "#D4A853", border: "rgba(212,168,83,0.3)" },
    Vertrouwen: { bg: "rgba(34,197,94,0.1)", text: "#4ade80", border: "rgba(34,197,94,0.25)" },
    Liefde: { bg: "rgba(251,113,133,0.1)", text: "#fb7185", border: "rgba(251,113,133,0.25)" },
    Genade: { bg: "rgba(167,139,250,0.1)", text: "#a78bfa", border: "rgba(167,139,250,0.25)" },
    Kracht: { bg: "rgba(248,113,113,0.1)", text: "#f87171", border: "rgba(248,113,113,0.25)" },
    Hoop: { bg: "rgba(34,211,238,0.1)", text: "#22d3ee", border: "rgba(34,211,238,0.25)" },
  };
  return map[thema] ?? { bg: "rgba(212,168,83,0.12)", text: "#D4A853", border: "rgba(212,168,83,0.3)" };
}

export default function ReadingPage({ params }: ReadingPageProps) {
  const router = useRouter();
  const dagId = parseInt(params.id, 10);
  const dag: BijbelDag | undefined = LEESPLAN.find((d) => d.id === dagId);

  const [voltooid, setVoltooid] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!dag) return;

    // Load saved state
    const voortgang = getDagVoortgang(dagId);
    setVoltooid(voortgang.voltooid);

    // Check for cached AI content
    const cached = getAIContent(dagId);
    if (cached) {
      setAiContent(cached);
      return;
    }

    // Fetch AI content
    fetchAIContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dagId]);

  const fetchAIContent = useCallback(async () => {
    if (!dag) return;
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch("/api/bijbel-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dagId: dag.id,
          referentie: dag.referentie,
          tekst: dag.tekst,
          thema: dag.thema,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Onbekende fout");
      }

      const data: AIContent = await response.json();
      setAiContent(data);
      saveAIContent(dagId, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fout bij laden";
      setAiError(message);
    } finally {
      setAiLoading(false);
    }
  }, [dag, dagId]);

  const handleMarkComplete = () => {
    const newState = !voltooid;
    setDagVoltooid(dagId, newState);
    setVoltooid(newState);
    if (newState) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 3000);
    }
  };

  if (!dag) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: "#9CA3AF" }}>
            Dag niet gevonden
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-ghost px-4 py-2 text-sm"
          >
            Terug naar overzicht
          </button>
        </div>
      </div>
    );
  }

  const themaColor = getThemaColor(dag.thema);

  // Navigate between days
  const prevDag = LEESPLAN.find((d) => d.id === dagId - 1);
  const nextDag = LEESPLAN.find((d) => d.id === dagId + 1);

  return (
    <main className="min-h-screen bg-black pb-20">
      {/* Top navigation bar */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#9CA3AF" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EDE8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
        >
          <span>←</span>
          <span>Overzicht</span>
        </button>

        <div className="flex items-center gap-1">
          <Cross size={20} className="opacity-70" />
          <span
            className="text-xs font-medium ml-1"
            style={{ color: "#6B7280" }}
          >
            Dag {dagId} / {LEESPLAN.length}
          </span>
        </div>

        {/* Completion toggle - compact */}
        <button
          onClick={handleMarkComplete}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all duration-200"
          style={{
            background: voltooid
              ? "rgba(21,128,61,0.2)"
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${voltooid ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: voltooid ? "#4ade80" : "#9CA3AF",
          }}
        >
          <span>{voltooid ? "✓" : "○"}</span>
          <span>{voltooid ? "Voltooid" : "Markeer"}</span>
        </button>
      </div>

      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(212,168,83,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 pt-8 space-y-8">
        {/* Day header */}
        <header
          className="animate-fade-in-up"
          style={{ animationFillMode: "both" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#6B7280" }}
            >
              Dag {dagId}
            </span>
            <span style={{ color: "#2a2a2a" }}>·</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: themaColor.bg,
                color: themaColor.text,
                border: `1px solid ${themaColor.border}`,
              }}
            >
              {dag.thema}
            </span>
          </div>

          <h1
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-1"
            style={{ color: "#F0EDE8" }}
          >
            {dag.titel}
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            {dag.boek} · {dag.referentie}
          </p>
        </header>

        {/* Bible text card */}
        <section
          className="rounded-xl overflow-hidden animate-fade-in-up"
          style={{
            animationDelay: "100ms",
            animationFillMode: "both",
            background: "#0D0D0D",
            border: "1px solid rgba(212,168,83,0.2)",
            borderTop: "2px solid rgba(212,168,83,0.35)",
          }}
        >
          {/* Card header */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background:
                "linear-gradient(135deg, rgba(212,168,83,0.05) 0%, transparent 60%)",
            }}
          >
            <div
              style={{
                width: "2px",
                height: "16px",
                background:
                  "linear-gradient(180deg, #D4A853, rgba(212,168,83,0.2))",
                borderRadius: "1px",
                flexShrink: 0,
              }}
            />
            <h2
              className="font-serif text-base font-semibold"
              style={{ color: "#D4A853" }}
            >
              {dag.referentie}
            </h2>
          </div>

          {/* Bible passage */}
          <div className="px-5 py-6">
            <div className="bible-text">
              {dag.tekst.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Just completed banner */}
        {justCompleted && (
          <div
            className="rounded-xl px-5 py-4 flex items-center gap-3 animate-fade-in-up"
            style={{
              background: "rgba(21,128,61,0.12)",
              border: "1px solid rgba(74,222,128,0.25)",
            }}
          >
            <span className="text-xl">✓</span>
            <div>
              <p
                className="font-medium text-sm"
                style={{ color: "#4ade80" }}
              >
                Dag {dagId} voltooid!
              </p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Geweldig – goed bezig met je leesplan.
              </p>
            </div>
          </div>
        )}

        {/* AI Content section */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "3px",
                  height: "18px",
                  background:
                    "linear-gradient(180deg, #60A5FA, rgba(96,165,250,0.2))",
                  borderRadius: "2px",
                }}
              />
              <h2
                className="font-serif text-lg sm:text-xl font-semibold"
                style={{ color: "#F0EDE8" }}
              >
                Bijbelstudie
              </h2>
            </div>

            {/* Retry button on error */}
            {aiError && !aiLoading && (
              <button
                onClick={fetchAIContent}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: "rgba(96,165,250,0.1)",
                  border: "1px solid rgba(96,165,250,0.25)",
                  color: "#60A5FA",
                }}
              >
                Opnieuw proberen
              </button>
            )}
          </div>

          {aiError && !aiLoading && !aiContent && (
            <div
              className="rounded-xl px-5 py-4 mb-4"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "#f87171" }}>
                Kon de studie niet laden: {aiError}
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                Zorg dat de OPENAI_API_KEY is geconfigureerd in .env.local
              </p>
            </div>
          )}

          <AIContentDisplay content={aiContent} loading={aiLoading} />
        </section>

        {/* Notes section */}
        {mounted && (
          <section
            className="animate-fade-in-up"
            style={{ animationDelay: "350ms", animationFillMode: "both" }}
          >
            <div
              className="rounded-xl p-5"
              style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  style={{
                    width: "3px",
                    height: "18px",
                    background:
                      "linear-gradient(180deg, #D4A853, rgba(212,168,83,0.2))",
                    borderRadius: "2px",
                  }}
                />
              </div>
              <Notes dagId={dagId} />
            </div>
          </section>
        )}

        {/* Complete Day button */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "450ms", animationFillMode: "both" }}
        >
          <button
            onClick={handleMarkComplete}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
            style={
              voltooid
                ? {
                    background: "rgba(21,128,61,0.15)",
                    border: "1px solid rgba(74,222,128,0.3)",
                    color: "#4ade80",
                  }
                : {
                    background: "linear-gradient(135deg, #92631e, #d4a853)",
                    color: "#0a0600",
                    boxShadow: "0 4px 20px rgba(212,168,83,0.25)",
                  }
            }
          >
            {voltooid
              ? "✓ Dag voltooid – klik om ongedaan te maken"
              : `Dag ${dagId} als voltooid markeren`}
          </button>
        </section>

        {/* Day navigation */}
        <nav
          className="flex items-center justify-between pt-2 animate-fade-in-up"
          style={{
            animationDelay: "500ms",
            animationFillMode: "both",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "1.5rem",
          }}
        >
          {prevDag ? (
            <button
              onClick={() => router.push(`/dag/${prevDag.id}`)}
              className="flex items-center gap-2 text-sm transition-colors group"
              style={{ color: "#6B7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EDE8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>Dag {prevDag.id}</span>
            </button>
          ) : (
            <div />
          )}

          {nextDag ? (
            <button
              onClick={() => router.push(`/dag/${nextDag.id}`)}
              className="flex items-center gap-2 text-sm transition-colors group"
              style={{ color: "#6B7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EDE8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              <span>Dag {nextDag.id}</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </main>
  );
}
