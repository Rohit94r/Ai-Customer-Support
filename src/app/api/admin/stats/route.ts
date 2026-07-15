import { isAdmin } from "@/lib/admin";
import connectDb from "@/lib/db";
import { getSession } from "@/lib/getSession";
import Settings from "@/model/settings.model";
import SiteEvent from "@/model/siteEvent.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDb();

    const bots = await Settings.find({})
      .select(
        "businessName supportEmail ownerId createdAt updatedAt totalQuestions lastChatAt knowledge"
      )
      .lean();

    const users = bots.map((bot) => {
      const totalQuestions = bot.totalQuestions ?? 0;
      const hasConfig = Boolean(
        (bot.businessName && String(bot.businessName).trim()) ||
          (bot.knowledge && String(bot.knowledge).trim())
      );
      return {
        businessName: bot.businessName || "Untitled",
        supportEmail: bot.supportEmail || "",
        ownerId: bot.ownerId,
        createdAt: bot.createdAt ?? null,
        totalQuestions,
        lastChatAt: bot.lastChatAt ?? null,
        configured: hasConfig,
      };
    });

    const totalUsers = users.length;
    const configuredBots = users.filter((u) => u.configured).length;
    const totalQuestions = users.reduce((sum, u) => sum + u.totalQuestions, 0);
    const botsWithActivity = users.filter((u) => u.totalQuestions > 0).length;

    const rankedByQuestions = [...users].sort(
      (a, b) => b.totalQuestions - a.totalQuestions
    );

    const recentChatActivity = [...users]
      .filter((u) => u.lastChatAt)
      .sort(
        (a, b) =>
          new Date(b.lastChatAt as Date).getTime() -
          new Date(a.lastChatAt as Date).getTime()
      )
      .slice(0, 15);

    const [pageViews, ctaClicks, eventsByType, eventsByPath, recentEvents] =
      await Promise.all([
        SiteEvent.countDocuments({ type: "page_view" }),
        SiteEvent.countDocuments({ type: "cta_click" }),
        SiteEvent.aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        SiteEvent.aggregate([
          { $match: { type: "page_view" } },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
        SiteEvent.find({})
          .sort({ createdAt: -1 })
          .limit(25)
          .select("type path label referrer createdAt")
          .lean(),
      ]);

    return NextResponse.json({
      summary: {
        totalUsers,
        configuredBots,
        totalQuestions,
        botsWithActivity,
        pageViews,
        ctaClicks,
        topChatbot: rankedByQuestions[0] ?? null,
      },
      users: rankedByQuestions,
      recentChatActivity,
      traffic: {
        pageViews,
        ctaClicks,
        eventsByType: eventsByType.map((row: { _id: string; count: number }) => ({
          type: row._id,
          count: row.count,
        })),
        topPaths: eventsByPath.map((row: { _id: string; count: number }) => ({
          path: row._id,
          count: row.count,
        })),
        recentEvents,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
