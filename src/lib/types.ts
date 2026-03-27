export interface BijbelDag {
  id: number;
  titel: string;
  boek: string;
  referentie: string;
  tekst: string; // The Dutch Bible passage (NBV style)
  thema: string;
  kleur: string; // accent color class for card gradients
}

export interface AIContent {
  titel: string;
  context: string;
  uitleg: string;
  reflectievragen: string[];
  gebedspunt: string;
}

export interface DagVoortgang {
  voltooid: boolean;
  voltooiDatum?: string;
  aantekeningen: string;
  aiContent?: AIContent;
}

export interface Voortgang {
  [dagId: number]: DagVoortgang;
}
