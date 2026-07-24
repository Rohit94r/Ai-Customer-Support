import connectDb from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateOwnerId } from "@/lib/validation";
import Settings from "@/model/settings.model";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      ownerId: rawOwnerId,
      businessName,
      businessType,
      website,
      supportEmail,
      phone,
      productsSummary,
      autoSave,
      defaultLanguage,
      supportedLanguages,
    } = await req.json();

    const ownerId = validateOwnerId(rawOwnerId);
    if (!ownerId || !businessName?.trim()) {
      return NextResponse.json(
        { message: "Owner ID and business name are required" },
        { status: 400 }
      );
    }

    const limit = checkRateLimit(`template:${ownerId}`, 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          message: `Template generation limit reached. Try again in about ${limit.retryAfterSec} seconds.`,
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Create a complete customer-support knowledge base template for this business.
Use the same structured format as a professional FAQ document with sections:
BUSINESS, WEBSITE, CONTACT, PRODUCTS & SERVICES, PRICING & OFFERS, SHIPPING & DELIVERY,
RETURN & REFUND, PAYMENT METHODS, SUPPORT & WARRANTY, FAQ (at least 5 Q&A pairs), BUSINESS HOURS.

Fill realistic placeholder values where the user did not provide details — use sensible Indian market defaults (INR, COD, UPI, IST hours).
Do not use markdown. Use plain text only. Be detailed and professional.

Business Name: ${businessName}
Business Type: ${businessType || "General business"}
Website: ${website || "Not provided"}
Support Email: ${supportEmail || "Not provided"}
Phone/WhatsApp: ${phone || "Not provided"}
Products/Services summary: ${productsSummary || "Not provided — infer typical offerings for this business type"}

Output only the knowledge base text, ready to paste into a chatbot.`,
        },
      ],
    });

    const knowledge =
      completion.choices[0]?.message?.content?.trim() ||
      "Could not generate template. Please try again.";

    if (autoSave) {
      await connectDb();
      await Settings.findOneAndUpdate(
        { ownerId },
        {
          businessName: businessName.trim(),
          ...(supportEmail?.trim() ? { supportEmail: supportEmail.trim() } : {}),
          knowledge,
          ...(defaultLanguage ? { defaultLanguage } : {}),
          ...(Array.isArray(supportedLanguages) ? { supportedLanguages } : {}),
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ knowledge, businessName: businessName.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: `Template generation failed: ${message}` }, { status: 500 });
  }
}
