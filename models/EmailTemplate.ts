import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['flash-sale', 'deal', 'newsletter', 'product-update', 'welcome'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    textContent: {
      type: String,
      required: true,
    },
    variables: [{
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      defaultValue: {
        type: String,
        default: "",
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: "admin",
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const EmailTemplate = 
  mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", emailTemplateSchema); 