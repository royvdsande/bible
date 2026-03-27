"use client";

import type { AIContent } from "@/lib/types";

interface AIContentDisplayProps {
  content: AIContent | null;
  loading: boolean;
}

function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: i === lines - 1 ? "65%" : "100%" }}
        />
      ))}
    </div>
  );
}

function SectionCard({
  title,
  accentColor,
  children,
  delay = 0,
}: {
  title: string;
  accentColor: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="rounded-xl p-5 animate-fade-in-up"
      style={{
        background: "#0D0D0D",
        border: `1px solid ${accentColor}`,
        borderTop: `2px solid ${accentColor}`,
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: accentColor }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function AIContentDisplay({
  content,
  loading,
}: AIContentDisplayProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-6 w-2/3 rounded mb-6" />
        <div className="grid gap-4">
          {[
            { color: "rgba(96,165,250,0.3)" },
            { color: "rgba(21,128,61,0.3)" },
            { color: "rgba(212,168,83,0.3)" },
            { color: "rgba(167,139,250,0.3)" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{
                background: "#0D0D0D",
                border: `1px solid ${s.color}`,
                borderTop: `2px solid ${s.color}`,
              }}
            >
              <div className="skeleton h-3 w-24 rounded mb-4" />
              <SkeletonBlock lines={i === 2 ? 4 : 3} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div>
      {/* AI section title */}
      {content.titel && (
        <h2
          className="font-serif text-xl sm:text-2xl font-semibold mb-5 animate-fade-in-up"
          style={{ color: "#F0EDE8" }}
        >
          {content.titel}
        </h2>
      )}

      <div className="grid gap-4">
        {/* Context */}
        <SectionCard
          title="Context"
          accentColor="rgba(96,165,250,0.5)"
          delay={0}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#C9D4E0" }}
          >
            {content.context}
          </p>
        </SectionCard>

        {/* Kernboodschap */}
        <SectionCard
          title="Kernboodschap"
          accentColor="rgba(21,128,61,0.5)"
          delay={100}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#C9D9CC" }}
          >
            {content.uitleg}
          </p>
        </SectionCard>

        {/* Reflectievragen */}
        <SectionCard
          title="Reflectievragen"
          accentColor="rgba(212,168,83,0.5)"
          delay={200}
        >
          <ol className="space-y-3">
            {content.reflectievragen.map((vraag, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mt-0.5"
                  style={{
                    background: "rgba(212,168,83,0.15)",
                    color: "#D4A853",
                    border: "1px solid rgba(212,168,83,0.3)",
                  }}
                >
                  {i + 1}
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#DDD4C0" }}
                >
                  {vraag}
                </p>
              </li>
            ))}
          </ol>
        </SectionCard>

        {/* Gebedspunt */}
        <SectionCard
          title="Gebedspunt"
          accentColor="rgba(167,139,250,0.5)"
          delay={300}
        >
          <div className="flex gap-3">
            <span
              className="text-xl mt-0.5 shrink-0"
              style={{ color: "rgba(167,139,250,0.6)" }}
            >
              ✦
            </span>
            <p
              className="text-sm leading-relaxed italic"
              style={{ color: "#CEC8E8" }}
            >
              {content.gebedspunt}
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
