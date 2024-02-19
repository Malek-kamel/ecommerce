import { Router } from "express";
import { isAuthenticated } from './../../middlware/authentication.middlware.js';
import { isAuthorized } from './../../middlware/authoriztion.middlware.js';
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middlware/validation.middlware.js";
import * as categoryShcema from './category.schema.js'
import * as categoryController from './category.controller.js'
import  subcategoryRouter  from "./../subcategory/subcategory.router.js";
const router = Router()
router.use("/:category/subcategory", subcategoryRouter);

//create category
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categoryShcema.createCategory),
  categoryController.createCategory
);

//update category
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categoryShcema.updateCategory),
  categoryController.updateCategory
);

// delete category
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(categoryShcema.deleteCategory),
  categoryController.deleteCategory
);

//all category
router.get(
  "/",
  categoryController.allCategory
);

export default router