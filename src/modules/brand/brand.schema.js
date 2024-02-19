import joi from "joi";
import { isValidObjectId } from "./../../middlware/validation.middlware.js";

// create Brand

export const createBrand = joi
  .object({
    name: joi.string().min(2).max(12).required(),
    categories: joi
      .array()
      .items(joi.string().custom(isValidObjectId))
      .required(),
  })
  .required();

// export const updateBrand = joi
//     .object({
//   id: joi.string().custom(isValidObjectId),
//   name: joi.string().required().min(2).max(12),
// }).required;

export const updateBrand = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
    name: joi.string().required().min(2).max(12),
  })
  .required();

// delete Brand;
export const deleteBrand = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();
