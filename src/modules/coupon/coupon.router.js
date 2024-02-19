import { Router } from "express";
import { isAuthenticated } from './../../middlware/authentication.middlware.js';
import { isAuthorized } from './../../middlware/authoriztion.middlware.js';
import { validation } from "../../middlware/validation.middlware.js";
import * as couponSchema from "./coupon.schema.js";
import * as couponController from "./coupon.controller.js";

const router = Router();

//create coupon
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.createCoupon),
  couponController.createCoupon
);

//update coupon
router.patch(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.updateCoupon),
  couponController.updateCoupon
);

//delete coupon
router.delete(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.deleteCoupon),
  couponController.deleteCoupon
);

// all coupon   
router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  couponController.allCoupon
);






export default router;
