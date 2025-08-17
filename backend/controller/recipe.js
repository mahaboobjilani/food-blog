const Recipes = require("../models/recipe.js");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload to Cloudinary using a promise
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "recipes" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Get all recipes
const getRecipes = async (req, res) => {
  const recipes = await Recipes.find({});
  console.log(recipes)
  return res.json(recipes);
};

// Get single recipe
const getRecipe = async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  return res.json(recipe);
};

// Add recipe
const addRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let coverImageUrl = "";
  if (req.file) {
    coverImageUrl = await uploadToCloudinary(req.file.buffer);
  }

  const recipe = await Recipes.create({
    title,
    ingredients,
    instructions,
    time,
    coverImage: coverImageUrl,
    createdBy: req.user.id,
  });

  return res.status(201).json(recipe);
};

// Edit recipe
const editRecipe = async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  let coverImageUrl = recipe.coverImage;
  if (req.file) {
    coverImageUrl = await uploadToCloudinary(req.file.buffer);
  }

  await Recipes.findByIdAndUpdate(
    req.params.id,
    { ...req.body, coverImage: coverImageUrl },
    { new: true }
  );

  return res.json({ message: "Recipe updated successfully" });
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  const recipe = await Recipes.findByIdAndDelete(req.params.id);
  return res.json({ message: `${recipe.title} - deleted successfully` });
};

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
};