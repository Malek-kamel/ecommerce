import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";

// create Brand
export const createBrand = asyncHandler(async (req, res, next) => {
  const { categories, name } = req.body;
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category)
      return next(new Error(`Category ${categoryId} not found!`), {
        cause: 404,
      });
  });
  if (!req.file)
    return next(new Error("Brand image is required", { cause: 400 }));
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/brand`,
    }
  );
  const brand = await Brand.create({
    name,
    slug: slugify(name),
    image: { url: secure_url, id: public_id },
  });
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    category.brands.push(brand._id);
    await category.save();
  });
  return res.json({
    success: true,
    message: "Brand created succussfully",
  });
});

// update Brand

export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error("Brand not found", { cause: 404 }));
  if ((req.file)) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      brand.image.id
    );
    brand.image = { url: secure_url, id: public_id };
    }
    brand.name = req.body.name ? req.body.name : brand.name
    brand.slug = req.body.name ? slugify(req.body.name) : brand.slug
    await brand.save()
      return res.json({
        success: true,
        message: "Brand updated succussfully",
      });

});

// delete Brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return next(new Error("Brand not found", { cause: 404 }));
    await cloudinary.uploader.destroy(brand.image.id);
    await Category.updateMany({}, { $pull: { brands: brand._id } })
          return res.json({
            success: true,
            message: "Brand deleted succussfully",
          });

});

// All Brand
export const allBrand = asyncHandler(async (req, res, next) => {
    const results = await Brand.find()
    return res.json({success:true,results})
 })