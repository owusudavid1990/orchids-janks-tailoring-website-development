import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { chatSchema, firstIssue } from "@/lib/validation";

// Max 20 chat messages per IP per 10 minutes (protects API spend)
const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant for JANKS Tailoring, a luxury bespoke menswear studio in London. You answer questions from potential and existing clients in a warm, professional, and concise manner that reflects the brand's heritage and craftsmanship values.

Key information about JANKS Tailoring:
- Services: Bespoke suits, bespoke shirts, bespoke trousers, made-to-measure garments, alterations and repairs
- Address: 3rd Floor, 86-90 Paul Street, London, EC2A 4NE
- Email: jankstailoring@gmail.com
- Phone/WhatsApp: +44 7828 338172
- Instagram: @official_janks.tailoring
- YouTube: @jankstailoring
- Founder: Kwaku Acheampong

Process: Clients can book a consultation via the website. During a consultation, our tailors take precise measurements. Bespoke garments are crafted to the client's exact measurements and style preferences.

Pricing: We do not publish fixed prices as each garment is bespoke. Clients should enquire directly for a quote.

After 2-3 exchanges, or if the query is complex, requires a personalised quote, or needs scheduling — gently invite the client to continue the conversation on WhatsApp at +44 7828 338172 or email jankstailoring@gmail.com.

Keep responses short (2-4 sentences max). Do not make up information. Be warm and elegant in tone.`;

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`chat:${getClientIp(req)}`, LIMIT, WINDOW_MS);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const parsed = chatSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
    }
    const { messages } = parsed.data;

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 512,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
