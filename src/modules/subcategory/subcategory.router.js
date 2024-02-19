import { Router } from "express";
import { isAuthorized } from "../../middlware/authoriztion.middlware.js";
import { isAuthenticated } from "../../middlware/authentication.middlware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middlware/validation.middlware.js";
import * as subcategoryController from './subcategory.controller.js'
import * as subcategoryShcema from './subcategory.schema.js'

const router = Router({mergeParams:true})
 
//create subcategory

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subcategoryShcema.createSubcategory),
  subcategoryController.createSubcategory
);

//update subcategory
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subcategoryShcema.updateSubcategory),
  subcategoryController.updateSubcategory
);
// delete subcategory
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(subcategoryShcema.deleteSubcategory),
  subcategoryController.deleteSubcategory
);

// all subcategory

router.get("/",validation(subcategoryShcema.allSubcategory),subcategoryController.allSubcategory);

export default router;