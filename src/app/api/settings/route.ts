import connectDb from "@/lib/db";
import { DEFAULT_CHAT_LANGUAGE, isSupportedLanguage } from "@/lib/chatLanguages";
import { LIMITS, validateOptionalEmail, validateOwnerId } from "@/lib/validation";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ownerId = validateOwnerId(body.ownerId);
    if (!ownerId) {
      return NextResponse.json({ message: "Owner ID is required" }, { status: 400 });
    }

    const businessName =
      typeof body.businessName === "string"
        ? body.businessName.trim().slice(0, LIMITS.businessNameMaxChars)
        : "";
    const knowledge =
      typeof body.knowledge === "string"
        ? body.knowledge.trim().slice(0, LIMITS.knowledgeMaxChars)
        : "";

    if (!businessName) {
      return NextResponse.json(
        { message: "Business name is required" },
        { status: 400 }
      );
    }

    const emailCheck = validateOptionalEmail(body.supportEmail);
    if (!emailCheck.ok) {
      return NextResponse.json({ message: emailCheck.error }, { status: 400 });
    }

    if (!knowledge) {
      return NextResponse.json(
        { message: "Add at least a short knowledge base so the chatbot can answer customers." },
        { status: 400 }
      );
    }

    const normalizedSupportedLanguages = Array.isArray(body.supportedLanguages)
      ? body.supportedLanguages.filter(
          (language: unknown): language is string =>
            typeof language === "string" && isSupportedLanguage(language)
        )
      : [];
    const safeSupportedLanguages = normalizedSupportedLanguages.length
      ? normalizedSupportedLanguages
      : [DEFAULT_CHAT_LANGUAGE, "hi-IN", "mr-IN", "gu-IN"];
    const safeDefaultLanguage =
      typeof body.defaultLanguage === "string" &&
      isSupportedLanguage(body.defaultLanguage) &&
      safeSupportedLanguages.includes(body.defaultLanguage)
        ? body.defaultLanguage
        : safeSupportedLanguages[0] || DEFAULT_CHAT_LANGUAGE;

    await connectDb();
    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      {
        businessName,
        supportEmail: emailCheck.email,
        knowledge,
        defaultLanguage: safeDefaultLanguage,
        supportedLanguages: safeSupportedLanguages,
      },
      { new: true, upsert: true }
    );
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { message: `Could not save settings. Please try again.` },
      { status: 400 }
    );
  }
}
