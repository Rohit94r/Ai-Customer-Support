import mongoose, { model, Schema } from "mongoose";

export type SiteEventType = "page_view" | "cta_click";

interface ISiteEvent {
  type: SiteEventType;
  path: string;
  label?: string;
  referrer?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const siteEventSchema = new Schema<ISiteEvent>(
  {
    type: {
      type: String,
      enum: ["page_view", "cta_click"],
      required: true,
      index: true,
    },
    path: {
      type: String,
      required: true,
      default: "/",
    },
    label: {
      type: String,
    },
    referrer: {
      type: String,
    },
  },
  { timestamps: true }
);

siteEventSchema.index({ createdAt: -1 });

const SiteEvent =
  mongoose.models.SiteEvent || model("SiteEvent", siteEventSchema);

export default SiteEvent;
