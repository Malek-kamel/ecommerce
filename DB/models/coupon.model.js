import { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: { type: String, require: true },
    discount: { type: Number, min: 1, max: 100, require: true },
    expireAt: { type: Number, require: true },
    createdBy: { type: Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true }
);

export const Coupon = model("Coupon", couponSchema);

