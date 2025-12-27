import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default:''
    },
    city: {
      type: String,
      default:''
    },
    address: {
      type: String,
      default:''
    },
    state: {
      type: String,
      default:''
    },
    email:{
      type:String,
      required:true,
      unique:true

    },
    password: {
      type: String,
      required: true,
    },
    roll: {
      type: String,
      default: 'user',
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
