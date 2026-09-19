import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ad title is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Ad image URL is required"],
    },
    externalLink: {
      type: String,
      required: [true, "External link is required"],
    },
    clientName: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    adSize: {
      type: String,
      enum: ["default", "compact", "banner", "skyscraper"],
      default: "default",
    },
    slot: {
      type: String,
      default: "general",
    },
    clicks: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Ad = mongoose.model("Ad", adSchema);

export default Ad;
