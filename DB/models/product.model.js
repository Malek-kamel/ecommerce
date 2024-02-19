import { Schema, model, Types } from "mongoose";
import cloudinary from "../../src/utils/cloud.js";

const productSchema = new Schema(
  {
    name: { type: String, require: true, min: 2, max: 20 },
    description: { type: String, min: 10, max: 200 },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    availableItems: { type: Number, min: 1, require: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, require: true },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Types.ObjectId, ref: "subcategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, required: true },
    averageRate: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strictQuery: true,
  }
);
productSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});
productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

productSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await cloudinary.api.delete_resources_by_prefix(
      `${process.env.CLOUD_FOLDER_NAME}/product/${this.cloudFolder}`
    );

    await cloudinary.api.delete_folder(
      `${process.env.CLOUD_FOLDER_NAME}/product/${this.cloudFolder}`
    );
  }
);

productSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 1;
  const skip = limit * (page - 1);
  return this.skip(skip).limit(limit);
};
productSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({ name: { $regex: keyword, $options: "i" } });
  }
};
productSchema.methods.inStock = function (requiredQuantity) {
  return this.availableItems >= requiredQuantity ? true : false;
};
export const Product = model("Product", productSchema);
