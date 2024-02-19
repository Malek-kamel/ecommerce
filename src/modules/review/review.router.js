import { Router } from "express";
import { isAuthenticated } from "./../../middlware/authentication.middlware.js";
import { isAuthorized } from "./../../middlware/authoriztion.middlware.js";
import { validation } from "../../middlware/validation.middlware.js";
import * as reviewSchema from "./review.schema.js";
import * as reviewController from "./review.controller.js";

const router = Router({ mergeParams: true });
// add review
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.addReview),
  reviewController.addReview
);

// update review
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.updateReview),
  reviewController.updateReview
);

export default router;
