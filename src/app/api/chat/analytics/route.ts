import connectDb from "@/lib/db";
import ChatQuestion from "@/model/chatQuestion.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ownerId } = await req.json();

    if (!ownerId) {
      return NextResponse.json({ message: "owner id is required" }, { status: 400 });
    }

    await connectDb();

    const [recentQuestions, topQuestions, analyticsSummary] = await Promise.all([
      ChatQuestion.find({ ownerId })
        .sort({ lastAskedAt: -1 })
        .limit(12)
        .select("latestQuestion normalizedQuestion askedCount cacheHits responseLanguage lastAskedAt recentQuestions")
        .lean(),
      ChatQuestion.find({ ownerId })
        .sort({ askedCount: -1, lastAskedAt: -1 })
        .limit(8)
        .select("latestQuestion normalizedQuestion askedCount cacheHits responseLanguage lastAskedAt")
        .lean(),
      ChatQuestion.aggregate([
        { $match: { ownerId } },
        {
          $group: {
            _id: null,
            uniqueQuestions: { $sum: 1 },
            cachedResponsesServed: { $sum: "$cacheHits" },
            repeatedQuestions: {
              $sum: {
                $cond: [{ $gt: ["$askedCount", 1] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      recentQuestions,
      topQuestions,
      summary: analyticsSummary[0] || {
        uniqueQuestions: 0,
        cachedResponsesServed: 0,
        repeatedQuestions: 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: `chat analytics error ${error}` },
      { status: 400 }
    );
  }
}
