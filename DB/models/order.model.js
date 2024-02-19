import { model, Types, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    address: { type: String, required: true },
    payment: {
      type: String,
      default: "cash",
      enum: ["cash", "visa"],
      required: true,
    },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    invoice: { url: String, id: String },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      required: true,
      default: "placed",
      enum: ["placed", "shipped", "delivered", "canceled", "refuned"],
    },
  },
  { timestamps: true }
);

orderSchema.virtual("finalPrice").get(function () {
  return this.coupon?
  Number.parseFloat(
    this.price - (this.price * this.coupon.discount || 0) / 100
    ).toFixed(2)
    : this.price
});

export const Order = model("Order", orderSchema);


