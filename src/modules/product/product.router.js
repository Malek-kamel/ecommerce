import { Router } from "express";
import { isAuthenticated } from "../../middlware/authentication.middlware.js";
import { isAuthorized } from "../../middlware/authoriztion.middlware.js";
import { fileUpload } from "./../../utils/fileUpload.js";
import { validation } from "../../middlware/validation.middlware.js";
import * as productSchema from "./product.schema.js";
import * as productController from "./product.controller.js";
import reviewRouter from "./../review/review.router.js"

const router = Router();
router.use("/:productId/review",reviewRouter)




// create Product
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  fileUpload().fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  validation(productSchema.createProduct),
  productController.createProduct
);

//delete product
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("seller"),
  validation(productSchema.deleteProduct),
  productController.deleteProduct
);

//all product
router.get(
  "/",
  productController.allProduct
);


export default router;
