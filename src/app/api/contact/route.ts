import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { upsertShopifyCustomer } from "@/lib/shopify-customers";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { contactSchema, escapeHtml, firstIssue } from "@/lib/validation";

// Max 5 submissions per IP per 10 minutes
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`contact:${getClientIp(req)}`, LIMIT, WINDOW_MS);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
    }

    // Raw values: used where real data is required (email recipient, Shopify records)
    const nameRaw = parsed.data.name;
    const emailRaw = parsed.data.email;
    const phoneRaw = parsed.data.phone ?? "";
    const messageRaw = parsed.data.message ?? "";
    const serviceRaw = parsed.data.service ?? "";
    const type = parsed.data.type;

    // Escaped copies: only for interpolating into the HTML email bodies below
    const name = escapeHtml(nameRaw);
    const email = escapeHtml(emailRaw);
    const phone = escapeHtml(phoneRaw);
    const message = escapeHtml(messageRaw);
    const service = escapeHtml(serviceRaw);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const isConsultation = type === "consultation";
    const subjectLabel = isConsultation ? "Consultation Request" : "New Message";
    const clientSubject = isConsultation
      ? `Your JANKS Consultation Request${service ? ` — ${service}` : ""}`
      : "We've received your message — JANKS Tailoring";

    // Notify JANKS team
    await transporter.sendMail({
      from: `"JANKS Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `${subjectLabel} — ${name}${service ? ` | ${service}` : ""}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1c1c1c; color: #FAF9F7; padding: 40px;">
          <div style="border-bottom: 1px solid #C9A962; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 24px; color: #C9A962; margin: 0 0 4px;">${subjectLabel}</h1>
            <p style="color: #999; font-size: 13px; margin: 0;">JANKS Tailoring — Website Enquiry</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #999; font-size: 13px; width: 140px;">Name</td><td style="padding: 8px 0; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #C9A962;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Phone</td><td style="padding: 8px 0; font-size: 14px;">${phone}</td></tr>` : ""}
            ${service ? `<tr><td style="padding: 8px 0; color: #999; font-size: 13px;">Service</td><td style="padding: 8px 0; font-size: 14px;">${service}</td></tr>` : ""}
            ${message ? `<tr><td style="padding: 8px 0; color: #999; font-size: 13px; vertical-align: top;">Message</td><td style="padding: 8px 0; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</td></tr>` : ""}
          </table>
          <p style="margin-top: 24px; font-size: 13px; color: #777;">Please respond to this client within 24 hours.</p>
        </div>
      `,
    });

    // Confirm to client
    await transporter.sendMail({
      from: `"JANKS Tailoring" <${process.env.SMTP_USER}>`,
      to: emailRaw,
      subject: clientSubject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1c1c1c; color: #FAF9F7; padding: 40px;">
          <div style="border-bottom: 1px solid #C9A962; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 24px; color: #C9A962; margin: 0 0 4px;">${isConsultation ? "Consultation Request Received" : "Message Received"}</h1>
            <p style="color: #999; font-size: 13px; margin: 0;">JANKS Tailoring, London</p>
          </div>
          <p style="font-size: 15px; margin-bottom: 24px;">Dear ${name},</p>
          <p style="font-size: 14px; color: #bbb; line-height: 1.7; margin-bottom: 24px;">
            ${isConsultation
              ? `Thank you for your consultation request${service ? ` for a <strong style="color: #FAF9F7;">${service}</strong>` : ""}. A member of the JANKS team will be in touch within <strong style="color: #C9A962;">24 hours</strong> to confirm your appointment details.`
              : `Thank you for reaching out to JANKS Tailoring. We have received your message and will get back to you within <strong style="color: #C9A962;">24 hours</strong>.`
            }
          </p>
          ${message ? `
          <div style="border-left: 2px solid #C9A962; padding-left: 16px; margin-bottom: 32px;">
            <p style="font-size: 13px; color: #777; line-height: 1.6; margin: 0;">${message.replace(/\n/g, "<br/>")}</p>
          </div>` : ""}
          <p style="font-size: 13px; color: #777; line-height: 1.6;">
            If you have any further questions, please reply to this email or call us on <a href="tel:+447828338172" style="color: #C9A962;">+44 7828 338172</a>.
          </p>
          <div style="border-top: 1px solid #333; margin-top: 32px; padding-top: 20px;">
            <p style="font-size: 12px; color: #555; margin: 0;">JANKS Tailoring · London · jankstailoring@gmail.com</p>
          </div>
        </div>
      `,
    });

    // Sync customer to Shopify (best-effort, non-blocking).
    // Uses the raw values so records aren't stored HTML-escaped.
    const [firstName, ...rest] = nameRaw.split(" ");
    const lastName = rest.join(" ") || undefined;

    let shopifySync;
    if (type === "newsletter") {
      shopifySync = await upsertShopifyCustomer({
        email: emailRaw,
        firstName: firstName || undefined,
        lastName,
        tags: "newsletter-subscriber",
        acceptsMarketing: true,
      });
    } else if (type === "consultation") {
      shopifySync = await upsertShopifyCustomer({
        email: emailRaw,
        firstName: firstName || undefined,
        lastName,
        phone: phoneRaw,
        tags: "consultation-request",
        note: serviceRaw ? `Service: ${serviceRaw}` : undefined,
      });
    } else {
      // type === "message"
      shopifySync = await upsertShopifyCustomer({
        email: emailRaw,
        firstName: firstName || undefined,
        lastName,
        phone: phoneRaw,
        tags: "website-enquiry",
        note: messageRaw ? `Message: ${messageRaw.slice(0, 200)}` : undefined,
      });
    }

    return NextResponse.json({ success: true, shopifySync });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
