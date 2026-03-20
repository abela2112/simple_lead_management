import mongoose from "mongoose";

const LEAD_STATUSES = [
  "New",
  "Engaged",
  "Proposal Sent",
  "Closed-Won",
  "Closed-Lost",
];
// Define the Lead schema
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

const Lead = mongoose.model("Lead", leadSchema);

export {
  Lead,
  LEAD_STATUSES,
};
