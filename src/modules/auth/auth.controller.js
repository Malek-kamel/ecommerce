import { asyncHandler } from "./../../utils/asyncHandler.js";
import { User } from "./../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "./../../utils/sendEmails.js";
import { signUpTemp, resetPassTemp } from "./../../utils/htmlTemplate.js";
import { Token } from "./../../../DB/models/token.model.js";
import randomstring from "randomstring";
import { Cart } from "../../../DB/models/cart.model.js";

// register
export const register = asyncHandler(async (req, res, next) => {
  const { email, userName, password } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new Error("user already existed!", { cause: 409 }));
  const token = jwt.sign({ email }, process.env.TOKEN_SECRET);
  await User.create({ ...req.body});
  const confirmationLink = `http://localhost:3000/auth/activate_account/${token}`;
  const messageSent = await sendEmail({
    to: email,
    subject: "activate Account",
    html: signUpTemp(confirmationLink),
  });
  if (!messageSent) return next(new Error("Somthing Went Wrong !"));
  return res.status(201).json({ success: true, message: "Check your email" });
});

//  activate Account
export const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });
  if (!user) return next(new Error("user not found", { cause: 404 }));
  // create a cart 
  await Cart.create({user:user._id})
  return res.json({ success: true, message: "Try to Login !" });
});

// login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid Email", { cause: 404 }));
  if (!user.isConfirmed)
    return next(new Error("please Activate the account first"));
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("Invalid Password"));
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_SECRET
  );
  await Token.create({ token, user: user._id });
  return res.json({ success: true, resulte: { token } });
});

// forget Code

export const forgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid Email", { cause: 404 }));
  const forgetCode = randomstring.generate({
    charset: "numeric",
    length: 5,
  });
  user.forgetCode = forgetCode;
  await user.save();
  const messageSent = await sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetPassTemp(forgetCode),
  });
  if (!messageSent) return next(new Error("somthing went wrong !"));
  return res.json({ success: true, message: "check your email  !" });
});

// reset Password

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid Email", { cause: 404 }));
  if (forgetCode !== user.forgetCode)
    return next(new Error("code is invalid !"));
  // user.password = bcryptjs.hashSync(password, parseInt(process.env.SALT_ROUND));
  await user.save();
    const tokens = await Token.find({user:user._id});
    
  tokens.forEach(async (token) => {
    token.isValid = false;
    await tokens.save();
  });

  return res.json({ success: true, message: "try to login now !" });
});
