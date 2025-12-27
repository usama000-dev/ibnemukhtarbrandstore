import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      defualt: "",
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentInfo: {
      type: String,
      default: "",
    },
    products: {
      type: Object,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      default: "unshifted",
    },
    phone: {
      type: String,
      required: true,
    },
    deliveryMethod: {
      type: String,
      default: "",
    },
    deliveryCharge: {
      type: String,
      default: "",
    },
    discountValue: {
      type: String,
      default: "",
    },
    couponCode: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      default: "",
    },
    deliveryVoucher: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
// delete mongoose.models.Order; // force delete old model

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
