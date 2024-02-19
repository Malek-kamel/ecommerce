import { Schema, Types, model } from "mongoose";
import { Subcategory } from "./subcategory.model.js";

const categorySchema = new Schema(
  {
    name: { type: String, require: true, unique: true, min: 5, max: 20 },
    slug: { type: String, require: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User", require: true },
    image: { id: { type: String }, url: { type: String } },
    brands: [{ type: Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true }
);

categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await Subcategory.deleteMany({
      category: this._id,
    });
  }
);
export const Category = model("Category", categorySchema);
