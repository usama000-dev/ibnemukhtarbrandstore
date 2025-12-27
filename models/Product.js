import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    disc: { type: String, required: true },
    size: { type: String },
    category: { type: String, required: true },
    color: { type: String },
    price: { type: Number, required: true },
    availability: { type: Number, required: true },
    productFor: { type: String },
    images: {
      type: [String],
      required: [true, "At least one product image is required."],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one product image is required.",
      },
    },

    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },

    // ✅ New fields below
    flashPrice: { type: Number, default: null },
    flashStart: { type: Date, default: null },
    flashEnd: { type: Date, default: null },

    discountPercent: { type: Number, default: 0 },

    bogo: {
      type: {
        triggerQty: Number,
        freeProductId: mongoose.Schema.Types.ObjectId,
      },
      default: null,
    },

    views: { type: Number, default: 0 },

    tags: { type: [String], default: [] },

    // YouTube video URL (optional)
    videoUrl: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow null/empty
          // Validate YouTube URL format - supports regular videos, shorts, embeds, and short links
          return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/.test(v);
        },
        message: 'Invalid YouTube URL format'
      }
    },

    // ✅ E-commerce & Shipping Fields
    trackingLink: {
      type: String,
      default: null,
      trim: true
    },

    weight: {
      type: Number,
      default: null, // in grams
      min: 0
    },

    dimensions: {
      length: { type: Number, default: null }, // in cm
      width: { type: Number, default: null },  // in cm
      height: { type: Number, default: null }  // in cm
    },

    brand: {
      type: String,
      default: 'Ibnemukhtar',
      trim: true
    },

    material: {
      type: String,
      default: null,
      trim: true
    },

    careInstructions: {
      type: String,
      default: null
    },

    warranty: {
      type: String,
      default: null
    },

    sku: {
      type: String,
      default: null,
      unique: true,
      sparse: true // Allows null values while maintaining uniqueness
    },

    condition: {
      type: String,
      enum: ['New', 'Pre-loved', 'Refurbished'],
      default: 'New'
    },

  },
  { timestamps: true }
);

// delete mongoose.models.Product;

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
