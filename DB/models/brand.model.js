import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, require: true, unique: true, min: 2, max: 12 },
    slug: { type: String, require: true, unique: true },
    image: {
      id: { type: String, require: true },
      url: { type: String, require: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true }
);

export const Brand = model("Brand", brandSchema);