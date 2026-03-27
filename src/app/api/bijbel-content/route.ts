import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `Je bent een wijze en empathische bijbelstudie-begeleider. Je taak is om een Bijbeltekst te analyseren en een gestructureerde, inspirerende studie te bieden voor een persoonlijk bijbelleesplan.

Antwoord ALTIJD met een geldig JSON-object in dit exacte formaat:
{
  "titel": "Een aansprekende, korte titel voor deze dag",
  "context": "2-3 zinnen over de historische en literaire context van de passage",
  "uitleg": "Een toegankelijke, inspirerende uitleg van de kernboodschap (4-6 zinnen)",
  "reflectievragen": [
    "Eerste diepgaande reflectievraag?",
    "Tweede persoonlijke reflectievraag?",
    "Derde praktische toepassingsvraag?"
  ],
  "gebedspunt": "Een persoonlijk, specifiek gebedspunt gebaseerd op de passage (2-3 zinnen)"
}

Gebruik warme, toegankelijke taal. Schrijf in het Nederlands. Wees praktisch en persoonlijk relevant.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key niet geconfigureerd" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { dagId, referentie, tekst, thema } = body as {
      dagId: number;
      referentie: string;
      tekst: string;
      thema: string;
    };

    if (!referentie || !tekst) {
      return NextResponse.json(
        { error: "Ontbrekende vereiste velden: referentie en tekst" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const userMessage = `Analyseer de volgende Bijbeltekst voor Dag ${dagId} van een 7-daags leesplan.

Thema van de dag: ${thema}
Bijbelreferentie: ${referentie}

Tekst:
${tekst}

Geef een gestructureerde bijbelstudie met context, kernboodschap, reflectievragen en een gebedspunt. Reageer uitsluitend met het gevraagde JSON-object.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: "Geen reactie ontvangen van AI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(responseText);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("Fout bij ophalen AI-content:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Kon AI-reactie niet verwerken" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het genereren van de studie" },
      { status: 500 }
    );
  }
}
