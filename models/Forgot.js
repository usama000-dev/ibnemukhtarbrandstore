import mongoose from "mongoose";

const ForgotSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// delete mongoose.models.Forgot; // force delete old model

export const Forgot =
  mongoose.models.Forgot || mongoose.model("Forgot", ForgotSchema);
