import { Router } from "express";
import { validation } from "./../../middlware/validation.middlware.js";
import * as authContoller from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";

const router = Router();

// Register

router.post(
  "/register",
  validation(authSchema.register),
  authContoller.register
);

// Activate Account

router.get(
  "/activate_account/:token",
  validation(authSchema.activateAccount),
  authContoller.activateAccount
);

// Login

router.post("/login", validation(authSchema.login), authContoller.login);

// forget code
router.patch(
  "/forgetCode",
  validation(authSchema.forgetCode),
  authContoller.forgetCode
);

// Reset Password
router.patch(
  "/resetPassword",
  validation(authSchema.resetPassword),
  authContoller.resetPassword
);

export default router;
