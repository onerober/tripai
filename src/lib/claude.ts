// TripAi — Wrapper del cliente de Claude API
// Toda llamada al modelo va por acá.

import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-4-5";
const FAST_MODEL = "claude-haiku-4-5";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Missing ANTHROPIC_API_KEY env var");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface CallClaudeOptions {
  system: string;
  user: string;
  model?: "default" | "fast";
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

// Precios aproximados (abril 2026, por M tokens)
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-5": { input: 3, output: 15 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};

export async function callClaude({
  system,
  user,
  model = "default",
  maxTokens = 4000,
  temperature = 0.7,
}: CallClaudeOptions): Promise<ClaudeResponse> {
  const modelId = model === "fast" ? FAST_MODEL : DEFAULT_MODEL;
  const client = getClient();

  const response = await client.messages.create({
    model: modelId,
    max_tokens: maxTokens,
    temperature,
    system,
    messages: [{ role: "user", content: user }],
  });

  // Extraer texto del response
  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const pricing = PRICING[modelId] ?? PRICING["claude-sonnet-4-5"];
  const costUsd = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;

  return { text, inputTokens, outputTokens, costUsd };
}

