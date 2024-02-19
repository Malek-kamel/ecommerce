import { Router } from "express";
import { isAuthenticated } from "./../../middlware/authentication.middlware.js";
import { isAuthorized } from "./../../middlware/authoriztion.middlware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middlware/validation.middlware.js";
import * as brandShcema from "./brand.schema.js";
import * as brandController from "./brand.controller.js";

const router = Router()

// create Brand

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandShcema.createBrand),
  brandController.createBrand
);

// update Brand
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandShcema.updateBrand),
  brandController.updateBrand
);

// delete Brand
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandShcema.deleteBrand),
  brandController.deleteBrand
);


// all Brand
router.get(
  "/",
  brandController.allBrand
);


export default router;
