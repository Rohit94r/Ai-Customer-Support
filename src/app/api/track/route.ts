import connectDb from "@/lib/db";
import SiteEvent from "@/model/siteEvent.model";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = new Set(["page_view", "cta_click"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = typeof body?.type === "string" ? body.type : "";
    const path =
      typeof body?.path === "string" && body.path.trim()
        ? body.path.trim().slice(0, 500)
        : "/";
    const label =
      typeof body?.label === "string" ? body.label.trim().slice(0, 200) : undefined;
    const referrer =
      typeof body?.referrer === "string"
        ? body.referrer.trim().slice(0, 500)
        : undefined;

    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    await connectDb();
    await SiteEvent.create({
      type,
      path,
      ...(label ? { label } : {}),
      ...(referrer ? { referrer } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
