import { Router } from "express";
import { isAuthenticated } from "../../middlware/authentication.middlware.js";
import { isAuthorized } from "../../middlware/authoriztion.middlware.js";
import { validation } from "../../middlware/validation.middlware.js";
import * as orderSchema from "./order.schema.js";
import * as orderController from "./order.controller.js";

const router = Router();

// create Order
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.creatOrder),
  orderController.createOrder
);
// cancel order
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.cancelOrder),
  orderController.cancelOrder
);

export default router;
