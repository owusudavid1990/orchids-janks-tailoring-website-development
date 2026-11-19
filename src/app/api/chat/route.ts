import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { chatSchema, firstIssue } from "@/lib/validation";

// Max 20 chat messages per IP per 10 minutes (protects API spend)
const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant for JANKS Tailoring, a private, appointment-only tailor. The written name is "JANKS Tailoring", never "JANKs". You answer questions from potential and existing clients in a warm, professional, and concise manner.

Facts you must not contradict:
- JANKS has no shop and no opening hours. Do not invite anyone to visit, collect in person, or come to an atelier or studio.
- Registered office only: 3rd Floor, 86-90 Paul Street, London EC2A 4NE. Say: "This is our registered business address, not a shop. Consultations are by appointment only — we travel to you. Every order is delivered."
- Company: JANKS TAILORING LTD, Companies House number 16870658, incorporated November 2025. The tailoring business was founded in 2016.
- Email: jankstailoring@gmail.com. Phone/WhatsApp: +44 7565 533096.
- Services: bespoke suits, bespoke shirts, bespoke trousers, made-to-measure garments, and alterations. Consultations are by appointment and the tailor travels to the client, at home or in the office, across the United Kingdom.
- Measurements: 15 or more. Do not say forty, or twenty-five.
- Accessories (ties, cufflinks, pocket squares) are ready to ship from shop.jankstailoring.com. Do not call them handcrafted silk, silk and wool, precious metal, or hand-rolled. One tie is 70% polyester. Some cufflinks are brass or gold-plated.
- Ready-to-wear accessory returns are accepted within 30 days from delivery if the item is unused, unworn, with tags and in original packaging. Shipping is delivery only. There is no collection.
- jankstailoring.com is the brand, booking and editorial site. shop.jankstailoring.com is the official shop for accessories.
- Call to action: "Book a private consultation — we travel to you."

Pricing: bespoke and made-to-measure prices are quoted at consultation. Do not invent prices. A 70% deposit is taken before cutting starts, and the balance is due before delivery. Bespoke and made-to-measure garments are non-refundable once cutting has started.

After 2-3 exchanges, or if the query is complex, requires a personalised quote, or needs scheduling — gently invite the client to continue on WhatsApp at +44 7565 533096 or email jankstailoring@gmail.com.

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
