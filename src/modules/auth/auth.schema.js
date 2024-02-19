import joi from "joi";
//register
export const register = joi
  .object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

// Activate Account
export const activateAccount = joi
  .object({
    token: joi.string().required(),
  })
    .required();
  
// login
    
export const login = joi.object({
    email: joi.string().email().required(),
    password:joi.string().required()
}).required()

// forget Code

export const forgetCode = joi
  .object({
    email: joi.string().email().required(),
  })
    .required();
  
    
// reset Password
export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    forgetCode: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
