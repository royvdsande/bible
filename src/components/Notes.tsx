"use client";

import { useEffect, useRef, useState } from "react";
import { getAantekeningen, saveAantekeningen } from "@/lib/storage";

interface NotesProps {
  dagId: number;
}

export default function Notes({ dagId }: NotesProps) {
  const [tekst, setTekst] = useState("");
  const [opgeslagen, setOpgeslagen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = getAantekeningen(dagId);
    setTekst(saved);
    setOpgeslagen(saved.length > 0);
  }, [dagId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTekst(val);
    setShowConfirm(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (confirmRef.current) clearTimeout(confirmRef.current);

    debounceRef.current = setTimeout(() => {
      saveAantekeningen(dagId, val);
      setOpgeslagen(true);
      setShowConfirm(true);

      confirmRef.current = setTimeout(() => {
        setShowConfirm(false);
      }, 2500);
    }, 1500);
  };

  const wordCount = tekst.trim() === "" ? 0 : tekst.trim().split(/\s+/).length;
  const charCount = tekst.length;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="font-serif text-lg sm:text-xl font-semibold"
          style={{ color: "#F0EDE8" }}
        >
          Mijn Aantekeningen
        </h2>

        {/* Save confirmation */}
        <span
          className="text-xs font-medium transition-all duration-300"
          style={{
            color: showConfirm ? "#4ade80" : "transparent",
          }}
        >
          Opgeslagen ✓
        </span>
      </div>

      {/* Textarea */}
      <textarea
        className="textarea-dark w-full p-4 min-h-[160px]"
        placeholder="Schrijf hier je gedachten, inzichten of gebeden..."
        value={tekst}
        onChange={handleChange}
        maxLength={5000}
      />

      {/* Footer: word/char count */}
      <div
        className="flex items-center justify-between mt-2 text-xs"
        style={{ color: "#4B5563" }}
      >
        <span>
          {wordCount} {wordCount === 1 ? "woord" : "woorden"}
        </span>
        <span>{charCount} / 5000 tekens</span>
      </div>
    </div>
  );
}
