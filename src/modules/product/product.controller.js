import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "./../../../DB/models/category.model.js";
import { Subcategory } from "./../../../DB/models/subcategory.model.js";
import { Brand } from "./../../../DB/models/brand.model.js";
import { nanoid } from "nanoid";
import cloudinary from "./../../utils/cloud.js";
import { Product } from "../../../DB/models/product.model.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));
  const subCategory = await Subcategory.findById(req.body.subcategory);
  if (!subCategory)
    return next(new Error("subCategory not found", { cause: 404 }));
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("brand not found", { cause: 404 }));
  if (!req.files)
    return next(new Error("product Images are requird", { cause: 400 }));
  const cloudFolder = nanoid();
  let images = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}` }
  );
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createBy: req.user._id,
    defaultImage: { id: public_id, url: secure_url },
    images,
    createdBy: req.user._id,
  });
  return res.json({ success: true, message: "product created successfuly" });
});

//delete product

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new Error("product not found", { cause: 404 }));
  if (req.user.id !== product.createdBy.toString())
    return next(new Error("Not Authorized", { cause: 401 }));
  await product.deleteOne();
  return res.json({
    success: true,
    message: "product Deleted successfuly",
  });
});

//all product
export const allProduct = asyncHandler(async (req, res, next) => {
  const { sort, page, keyword, category, subcategory, brand } = req.query;
  if (category && !(await Category.findById(category)))
    return next(new Error("category not found !", { cause: 404 }));
  if (subcategory && !(await Subcategory.findById(subcategory)))
    return next(new Error("subcategory not found !", { cause: 404 }));
  if (brand && !(await Brand.findById(brand)))
    return next(new Error("brand not found !", { cause: 404 }));

  const results = await Product.find({ ...req.query })
    .sort(sort)
    .paginate(page)
    .search(keyword);
  return res.json({ success: true, results });
});
