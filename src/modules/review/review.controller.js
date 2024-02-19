import { Product } from "../../../DB/models/product.model.js";
import { Review } from "../../../DB/models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "./../../../DB/models/order.model.js";


//add review
export const addReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;

  const order = await Order.findOne({
    user: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order)
    return next(new Error("can not review this product"), { cause: 400 });
  if (
    await Review.findOne({
      createdBy: req.user._id,
      productId: productId,
    })
  )
    return next(new Error("Already reviewed by you"), { cause: 400 });
  const review = await Review.create({
    comment,
    rating,
    createdBy: req.user._id,
    orderId: order._id,
    productId: productId,
  });
  let calcRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });

  for (let i = 0; i < reviews.length; i++) {
    calcRating += reviews[i].rating;
  }
  product.averageRate = calcRating / reviews.length;

  await product.save();
  return res.json({ success: true, review });
});

// update review

export const updateReview = asyncHandler(async (req, res, next) => {
  const { id, productId } = req.params;
  const review = await Review.updateOne(
    { _id: id, productId },
    { ...req.body }
  );
  if (!review) return next(new Error("Review not found"));
  let calcRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });

  for (let i = 0; i < reviews.length; i++) {
    calcRating += reviews[i].rating;
  }
  product.averageRate = calcRating / reviews.length;

  await product.save();

  return res.json({ success: true, message: "Review updated successfully" });
});
