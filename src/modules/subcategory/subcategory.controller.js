import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";

//create subcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));

  if (!req.file)
    return next(new Error("Subcategory image is required", { cause: 400 }));
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory`,
    }
  );

  await Subcategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    category: req.params.category,
  });
  return res.json({
    success: true,
    message: "subcategory created succussfully",
  });
});

//update category

export const updateSubcategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("Category not found", { cause: 404 }));
  const subcategory = await Subcategory.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("Subcategory not found", { cause: 404 }));

  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("not allowed to update subcategory"));
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: subcategory.image.id }
    );
    subcategory.image = { id: public_id, url: secure_url };
  }
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;
  await subcategory.save();
  return res.json({
    success: true,
    message: "Subcategory updated succussfully",
  });
});

// delete Category

export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("Category not found", { cause: 404 }));
  const subcategory = await Subcategory.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("Subcategory not found", { cause: 404 }));
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("not allowed to update Category"));
  await Subcategory.findOneAndDelete(req.params.id);

  await cloudinary.uploader.destroy(subcategory.image.id);
  return res.json({
    success: true,
    message: "subcategory deleted succussfully",
  });
});


// all subcategory

export const allSubcategory = asyncHandler(async (req, res, next) => {
    if (req.params.category) {
        const results = await Subcategory.find({ category: req.params.category });
        return res.json({ success: true, results });

    }
  const results = await Subcategory.find();
  return res.json({ success: true, results });
});
