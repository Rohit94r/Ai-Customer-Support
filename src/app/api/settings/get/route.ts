import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { CHAT_LANGUAGES, DEFAULT_CHAT_LANGUAGE } from "@/lib/chatLanguages";
import { FREE_MONTHLY_QUESTION_LIMIT, currentPeriodKey, usageStatus } from "@/lib/usage";
import { validateOwnerId } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ownerId = validateOwnerId(body.ownerId);
    if (!ownerId) {
      return NextResponse.json({ message: "Owner ID is required" }, { status: 400 });
    }

    await connectDb();
    const settings = await Settings.findOne({ ownerId }).lean();
    const periodKey = currentPeriodKey();

    if (!settings) {
      return NextResponse.json({
        businessName: "",
        supportEmail: "",
        knowledge: "",
        defaultLanguage: DEFAULT_CHAT_LANGUAGE,
        supportedLanguages: CHAT_LANGUAGES.map((language) => language.code),
        totalQuestions: 0,
        lastChatAt: null,
        monthlyQuestions: 0,
        monthlyPeriodKey: periodKey,
        usage: usageStatus(0),
        freeMonthlyLimit: FREE_MONTHLY_QUESTION_LIMIT,
      });
    }

    const monthlyQuestions =
      settings.monthlyPeriodKey === periodKey ? settings.monthlyQuestions || 0 : 0;

    return NextResponse.json({
      ...settings,
      monthlyQuestions,
      monthlyPeriodKey: periodKey,
      usage: usageStatus(monthlyQuestions),
      freeMonthlyLimit: FREE_MONTHLY_QUESTION_LIMIT,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `get settings error ${error}` },
      { status: 400 }
    );
  }
}
