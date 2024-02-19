import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, require: true },
    userId: { type: Types.ObjectId, ref: "User" },
    isValid: { type: Boolean, default: true },
    agent: { type: String },
    expiredAt: { type: String },
  },
  { timestamps: true }
);

export const Token = model("Token", tokenSchema);
