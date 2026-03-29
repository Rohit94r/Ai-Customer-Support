import connectDb from "@/lib/db";
import { DEFAULT_CHAT_LANGUAGE, isSupportedLanguage } from "@/lib/chatLanguages";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ownerId = req.nextUrl.searchParams.get("ownerId");

  if (!ownerId) {
    return NextResponse.json({ message: "owner id is required" }, { status: 400 });
  }

  try {
    await connectDb();
    const settings = await Settings.findOne({ ownerId }).lean();

    if (!settings) {
      return NextResponse.json(
        {
          businessName: "Apna AI",
          defaultLanguage: DEFAULT_CHAT_LANGUAGE,
          supportedLanguages: [DEFAULT_CHAT_LANGUAGE, "hi-IN", "mr-IN", "gu-IN"],
        },
        { status: 200 }
      );
    }

    const supportedLanguages = Array.isArray(settings.supportedLanguages)
      ? settings.supportedLanguages.filter((language: string) => isSupportedLanguage(language))
      : [DEFAULT_CHAT_LANGUAGE, "hi-IN", "mr-IN", "gu-IN"];

    const defaultLanguage =
      typeof settings.defaultLanguage === "string" &&
      isSupportedLanguage(settings.defaultLanguage) &&
      supportedLanguages.includes(settings.defaultLanguage)
        ? settings.defaultLanguage
        : supportedLanguages[0] || DEFAULT_CHAT_LANGUAGE;

    return NextResponse.json({
      businessName: settings.businessName || "Apna AI",
      defaultLanguage,
      supportedLanguages,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `widget settings error ${error}` },
      { status: 500 }
    );
  }
}
