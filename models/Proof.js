import mongoose from "mongoose";

const ProofSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    email:{
      type:String,
      required:true,
    },
    name:{
      type:String,
    },
    proofimgurl:{
      type:String,
      required:true,
    },
    amount: {
      type: Number,
      required: true,
    },
    

  },
  { timestamps: true }
);
// delete mongoose.models.Proof; // force delete old model

export const Proof =
  mongoose.models.Proof || mongoose.model("Proof", ProofSchema);
