import { model, Types, Schema } from "mongoose";

const cartSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    user: { type: Types.ObjectId, ref: "User", require: true, unique: true },
  },
  { timestamps: true }
);

export const Cart = model("Cart", cartSchema);
