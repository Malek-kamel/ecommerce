import joi from "joi";
import { isValidObjectId } from "../../middlware/validation.middlware.js";

// add to cart
export const addToCart = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
    quantity: joi.number().integer().min(1),
  })
  .required();

// get user cart
export const userCart = joi
  .object({
    cartId: joi.string().custom(isValidObjectId),
  })
  .required();

//update Cart
export const updateCart = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
    quantity: joi.number().integer().min(1).required(),
  })
    .required();
  
// remove product from cart

export const removeFromCart = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
