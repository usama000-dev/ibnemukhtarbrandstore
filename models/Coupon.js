// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'freeShipping'],
    required: true
  },
  discountValue: {
    type: Number,
    required: function () {
      return this.discountType !== 'freeShipping';
    },
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: Date,
  maxUses: {
    type: Number,
    default: 0 // 0 = unlimited
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // New fields for applicability
  applyTo: {
    type: String,
    enum: ['all', 'categories', 'products'],
    default: 'all'
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Force delete old model if exists
// delete mongoose.models.Coupon;

export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);