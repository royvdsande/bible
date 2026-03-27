"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BijbelDag } from "@/lib/types";
import { getDagVoortgang } from "@/lib/storage";

interface DayCardProps {
  dag: BijbelDag;
  isToday: boolean;
}

// Icon map per theme
const THEMA_ICONS: Record<string, string> = {
  Begin: "✦",
  Vertrouwen: "☽",
  Liefde: "♡",
  Genade: "✧",
  Kracht: "⚡",
  Hoop: "★",
};

// Color accent per kleur class
const KLEUR_ACCENT: Record<string, string> = {
  "from-amber-900/20 to-transparent": "rgba(212,168,83,0.25)",
  "from-green-900/20 to-transparent": "rgba(34,197,94,0.2)",
  "from-blue-900/20 to-transparent": "rgba(96,165,250,0.2)",
  "from-purple-900/20 to-transparent": "rgba(167,139,250,0.2)",
  "from-red-900/20 to-transparent": "rgba(248,113,113,0.2)",
  "from-rose-900/20 to-transparent": "rgba(251,113,133,0.2)",
  "from-cyan-900/20 to-transparent": "rgba(34,211,238,0.2)",
};

const KLEUR_BORDER: Record<string, string> = {
  "from-amber-900/20 to-transparent": "rgba(212,168,83,0.2)",
  "from-green-900/20 to-transparent": "rgba(34,197,94,0.15)",
  "from-blue-900/20 to-transparent": "rgba(96,165,250,0.15)",
  "from-purple-900/20 to-transparent": "rgba(167,139,250,0.15)",
  "from-red-900/20 to-transparent": "rgba(248,113,113,0.15)",
  "from-rose-900/20 to-transparent": "rgba(251,113,133,0.15)",
  "from-cyan-900/20 to-transparent": "rgba(34,211,238,0.15)",
};

export default function DayCard({ dag, isToday }: DayCardProps) {
  const router = useRouter();
  const [voltooid, setVoltooid] = useState(false);

  useEffect(() => {
    const voortgang = getDagVoortgang(dag.id);
    setVoltooid(voortgang.voltooid);
  }, [dag.id]);

  const accentColor = KLEUR_ACCENT[dag.kleur] ?? "rgba(212,168,83,0.2)";
  const borderColor = KLEUR_BORDER[dag.kleur] ?? "rgba(212,168,83,0.15)";
  const icon = THEMA_ICONS[dag.thema] ?? "✦";

  const handleClick = () => {
    router.push(`/dag/${dag.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="group w-full text-left relative overflow-hidden rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4A853]/40"
      style={{
        background: "#0D0D0D",
        border: `1px solid ${isToday ? "rgba(212,168,83,0.35)" : voltooid ? "rgba(21,128,61,0.3)" : borderColor}`,
        boxShadow: isToday
          ? "0 0 0 1px rgba(212,168,83,0.15), 0 4px 24px rgba(0,0,0,0.4)"
          : "0 2px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Background gradient tint */}
      <div
        className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 20% 20%, ${accentColor} 0%, transparent 65%)`,
        }}
      />

      {/* Today glow edge */}
      {isToday && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.7), transparent)",
          }}
        />
      )}

      {/* Card content */}
      <div className="relative p-4 sm:p-5">
        {/* Top row: Day number + status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Day number badge */}
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0"
              style={{
                background: isToday
                  ? "rgba(212,168,83,0.15)"
                  : voltooid
                  ? "rgba(21,128,61,0.15)"
                  : "rgba(255,255,255,0.05)",
                color: isToday
                  ? "#D4A853"
                  : voltooid
                  ? "#4ade80"
                  : "#9CA3AF",
                border: `1px solid ${
                  isToday
                    ? "rgba(212,168,83,0.3)"
                    : voltooid
                    ? "rgba(74,222,128,0.25)"
                    : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              {dag.id}
            </span>

            {/* Today badge */}
            {isToday && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{
                  background: "rgba(212,168,83,0.12)",
                  color: "#D4A853",
                  border: "1px solid rgba(212,168,83,0.25)",
                }}
              >
                Vandaag
              </span>
            )}
          </div>

          {/* Status icon */}
          <div className="shrink-0">
            {voltooid ? (
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full"
                style={{
                  background: "rgba(21,128,61,0.2)",
                  color: "#4ade80",
                  fontSize: "14px",
                }}
                title="Voltooid"
              >
                ✓
              </span>
            ) : (
              <span
                className="text-lg opacity-50 group-hover:opacity-80 transition-opacity"
                style={{ color: "#9CA3AF" }}
              >
                {icon}
              </span>
            )}
          </div>
        </div>

        {/* Book & Title */}
        <div className="mb-2">
          <p
            className="text-xs font-medium mb-0.5 uppercase tracking-wider"
            style={{ color: "#9CA3AF" }}
          >
            {dag.boek}
          </p>
          <h3
            className="font-serif text-base sm:text-lg font-semibold leading-tight"
            style={{ color: "#F0EDE8" }}
          >
            {dag.titel}
          </h3>
        </div>

        {/* Reference */}
        <p
          className="text-xs mb-3"
          style={{ color: "#6B7280" }}
        >
          {dag.referentie}
        </p>

        {/* Theme tag */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#6B7280",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {dag.thema}
          </span>

          {/* Arrow on hover */}
          <span
            className="text-sm opacity-0 group-hover:opacity-60 transition-all duration-200 translate-x-0 group-hover:translate-x-1"
            style={{ color: "#D4A853" }}
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
}
