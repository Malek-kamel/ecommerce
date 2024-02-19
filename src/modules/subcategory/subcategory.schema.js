import joi from "joi";
import { isValidObjectId } from "./../../middlware/validation.middlware.js";

//create subcategory
export const createSubcategory = joi
  .object({
    name: joi.string().min(5).max(20).required(),
    category: joi.string().custom(isValidObjectId).required(),
  })
  .required();

  //update subcategory
export const updateSubcategory = joi
  .object({
    name: joi.string().min(5).max(20),
    id: joi.string().custom(isValidObjectId).required(),
    category: joi.string().custom(isValidObjectId).required(),
  })
  .required();
  //delete subcategory
export const deleteSubcategory = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
    category: joi.string().custom(isValidObjectId).required(),
  })
  .required();


  export const allSubcategory = joi
    .object({
      category: joi.string().custom(isValidObjectId)
    })
    .required();