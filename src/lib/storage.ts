import type { AIContent, DagVoortgang, Voortgang } from "./types";

const STORAGE_KEY = "bijbel_voortgang";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getVoortgang(): Voortgang {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Voortgang;
  } catch {
    return {};
  }
}

function setVoortgang(voortgang: Voortgang): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voortgang));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function getDagVoortgang(dagId: number): DagVoortgang {
  const voortgang = getVoortgang();
  return (
    voortgang[dagId] ?? {
      voltooid: false,
      aantekeningen: "",
    }
  );
}

export function setDagVoltooid(dagId: number, voltooid: boolean): void {
  const voortgang = getVoortgang();
  const dag = getDagVoortgang(dagId);
  voortgang[dagId] = {
    ...dag,
    voltooid,
    voltooiDatum: voltooid ? new Date().toISOString() : undefined,
  };
  setVoortgang(voortgang);
}

export function saveAantekeningen(dagId: number, tekst: string): void {
  const voortgang = getVoortgang();
  const dag = getDagVoortgang(dagId);
  voortgang[dagId] = {
    ...dag,
    aantekeningen: tekst,
  };
  setVoortgang(voortgang);
}

export function saveAIContent(dagId: number, content: AIContent): void {
  const voortgang = getVoortgang();
  const dag = getDagVoortgang(dagId);
  voortgang[dagId] = {
    ...dag,
    aiContent: content,
  };
  setVoortgang(voortgang);
}

export function getAIContent(dagId: number): AIContent | null {
  const dag = getDagVoortgang(dagId);
  return dag.aiContent ?? null;
}

export function getAantekeningen(dagId: number): string {
  const dag = getDagVoortgang(dagId);
  return dag.aantekeningen ?? "";
}

export function getTotaalVoltooid(): number {
  const voortgang = getVoortgang();
  return Object.values(voortgang).filter((d) => d.voltooid).length;
}
