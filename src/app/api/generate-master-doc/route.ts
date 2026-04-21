// TripAi — API route: generar documento maestro de un viaje.
// POST /api/generate-master-doc
// Body: { trip: Trip, locale: 'es' | 'en' }

import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/claude";
import {
  SYSTEM_PROMPT_ES,
  SYSTEM_PROMPT_EN,
  buildUserPrompt,
} from "@/lib/prompts/generate-master-doc";
import type { Trip } from "@/types/trip";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { trip: Trip; locale: "es" | "en" };
    const { trip, locale } = body;

    if (!trip || !trip.destination?.city) {
      return NextResponse.json({ error: "Invalid trip data" }, { status: 400 });
    }

    const system = locale === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ES;
    const user = buildUserPrompt(trip, locale);

    const { text, inputTokens, outputTokens, costUsd } = await callClaude({
      system,
      user,
      model: "default",
      maxTokens: 8000,
      temperature: 0.7,
    });

    return NextResponse.json({
      masterDoc: text,
      usage: { inputTokens, outputTokens, costUsd },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate-master-doc error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

