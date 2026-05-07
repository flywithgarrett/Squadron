import Anthropic from "@anthropic-ai/sdk";
import { CONTENT_TYPES } from "./content-types";
import type { ContentType, Platform } from "./types";

const MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  if (!client) client = new Anthropic({ apiKey: key });
  return client;
}

export function isAnthropicReady(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

const BASE_VOICE = `You are generating content for The Squadron NYC, a premium F-35 simulator experience at 7 World Trade Center in Manhattan. The audience is primarily B2C: aviation enthusiasts, gift buyers, NYC experience seekers, plus some corporate decision makers.

Voice rules (non-negotiable):
- Cinematic but human. Like a fighter pilot talking to a friend.
- Use words like: mission, brief, debrief, sortie, wingman, cockpit, ignition.
- Never use the words: fun, awesome, amazing, cool, hangout, party.
- One exclamation point per script maximum.
- Hooks must stop the scroll within the first second.
- Limited em dashes. Write in clean sentences.

Output: clean text with no preamble, no commentary, no markdown formatting. Just the script or copy itself.`;

function buildSystemPrompt({
  contentType,
  platforms,
}: {
  contentType?: ContentType;
  platforms?: Platform[];
}): string {
  const parts = [BASE_VOICE];

  if (contentType) {
    const cfg = CONTENT_TYPES[contentType];
    parts.push(
      `\nContent type: ${contentType}. Description: ${cfg.description}`,
    );
  }

  if (platforms && platforms.length) {
    parts.push(`\nTarget platforms: ${platforms.join(", ")}.`);
  }

  return parts.join("\n");
}

export async function generateScript({
  prompt,
  contentType,
  platforms,
}: {
  prompt: string;
  contentType?: ContentType;
  platforms?: Platform[];
}): Promise<string> {
  const c = getClient();
  if (!c) throw new Error("ANTHROPIC_API_KEY not configured.");

  const response = await c.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt({ contentType, platforms }),
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  if (!text) throw new Error("Empty response from model.");
  return text;
}
