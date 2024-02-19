import joi from "joi";
import {isValidObjectId} from './../../middlware/validation.middlware.js'


//create category
export const createCategory = joi
  .object({
    name: joi.string().min(5).max(20).required(),
  })
  .required();

//update Category
export const updateCategory = joi
  .object({
    name: joi.string().min(5).max(20),
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

  //delete Category
export const deleteCategory = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();
