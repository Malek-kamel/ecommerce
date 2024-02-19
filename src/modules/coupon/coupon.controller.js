import { Coupon } from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";
export const createCoupon = asyncHandler(async (req, res, next) => {
  const code = voucher_codes.generate({ length: 5 });
  const coupon = await Coupon.create({
    name: code[0],
    createdBy: req.user._id,
    discount: req.body.discount,
    expireAt: new Date(req.body.expireAt).getTime(),
  });
  return res.status(201).json({ success: true, coupon });
});

//update Coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expireAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error("coupon not found", { cause: 404 }));
  if (req.user.id !== coupon.createdBy.toString())
    return next(new Error("Not Authorized", { cause: 403 }));

  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expireAt = req.body.expireAt
    ? new Date(req.body.expireAt)
    : coupon.expireAt;
  await coupon.save();

  return res.json({ success: true, message: "coupon updated successfly" });
});

//delete Coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ name: req.params.code });
    if (!coupon) return next(new Error("coupon not found", { cause: 404 }));
      if (req.user.id !== coupon.createdBy.toString())
        return next(new Error("Not Authorized", { cause: 403 }));
    await Coupon.deleteOne();


  return res.json({ success: true, message: "coupon deleted successfly" });
});

//all Coupon
export const allCoupon = asyncHandler(async (req, res, next) => {
    if (req.user.role === "admin") {
        const coupons = await Coupon.find()
      return res.json({ success: true, coupons });
    }
        if (req.user.role === "seller") {
          const coupons = await Coupon.find({createdBy:req.user._id});
          return res.json({ success: true, coupons });
        }

});

