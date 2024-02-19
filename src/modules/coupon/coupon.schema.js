import joi from "joi";

export const createCoupon = joi
  .object({
    discount: joi.number().integer().min(1).max(100).required(),
    expireAt: joi.date().greater(Date.now()).required(),
  })
  .required();

// update coupon
export const updateCoupon = joi
  .object({
    discount: joi.number().integer().min(1).max(100).required(),
    expireAt: joi.date().greater(Date.now()).required(),
    code: joi.string().length(5).required(),
  })
    .required();
  
    //delete Coupon
export const deleteCoupon = joi
  .object({
    code: joi.string().length(5).required(),
  })
  .required();

// all coupon
  
