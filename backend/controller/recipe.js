// const Recipes = require("../models/recipe.js");
// const multer = require("multer");
// const cloudinary = require("../config/cloudinary");

// // Multer memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Helper to upload to Cloudinary using a promise
// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "recipes" },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result.secure_url);
//       }
//     );
//     stream.end(buffer);
//   });
// };

// // Get all recipes
// const getRecipes = async (req, res) => {
//   try {
//     const recipes = await Recipes.find({})
//       .populate("createdBy", "username") // ✅ show username only
//       .sort({ createdAt: -1 });

//     return res.json(recipes);
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Get single recipe
// const getRecipe = async (req, res) => {
//   const recipe = await Recipes.findById(req.params.id);
//   return res.json(recipe);
// };

// // Add recipe
// const addRecipe = async (req, res) => {
//   const { title, ingredients, instructions, time } = req.body;

//   if (!title || !ingredients || !instructions) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   let coverImageUrl = "";
//   if (req.file) {
//     coverImageUrl = await uploadToCloudinary(req.file.buffer);
//   }

//   const recipe = await Recipes.create({
//     title,
//     ingredients,
//     instructions,
//     time,
//     coverImage: coverImageUrl,
//     createdBy: req.user.id,
//   });

//   return res.status(201).json(recipe);
// };

// // Edit recipe
// const editRecipe = async (req, res) => {
//   const recipe = await Recipes.findById(req.params.id);
//   if (!recipe) return res.status(404).json({ message: "Recipe not found" });

//   let coverImageUrl = recipe.coverImage;
//   if (req.file) {
//     coverImageUrl = await uploadToCloudinary(req.file.buffer);
//   }

//   await Recipes.findByIdAndUpdate(
//     req.params.id,
//     { ...req.body, coverImage: coverImageUrl },
//     { new: true }
//   );

//   return res.json({ message: "Recipe updated successfully" });
// };

// // Delete recipe
// const deleteRecipe = async (req, res) => {
//   const recipe = await Recipes.findByIdAndDelete(req.params.id);
//   return res.json({ message: `${recipe.title} - deleted successfully` });
// };

// module.exports = {
//   getRecipes,
//   getRecipe,
//   addRecipe,
//   editRecipe,
//   deleteRecipe,
//   upload,
// };

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
// Get all recipes (with optional category filter)
const getRecipes = async (req, res) => {
  try {
    const { category } = req.query; // ✅ accept ?category query
    const filter = category ? { category } : {};

    const recipes = await Recipes.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    return res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single recipe
const getRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === "allRecipes") {
      const recipes = await Recipes.find({})
        .populate("createdBy", "username")
        .sort({ createdAt: -1 });
      return res.json(recipes);
    }

    const recipe = await Recipes.findById(id).populate("createdBy", "username");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    return res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add recipe
const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time, category } = req.body;

    // Check all required fields
    if (!title || !ingredients || !instructions || !time || !category) {
      return res.status(400).json({ message: "All fields including category are required" });
    }

    // Parse ingredients properly
    let ingredientsArr = [];
    if (typeof ingredients === "string") {
      try {
        ingredientsArr = JSON.parse(ingredients); // If frontend sends JSON string
      } catch {
        ingredientsArr = ingredients.split(",").map(i => i.trim()); // fallback
      }
    } else {
      ingredientsArr = ingredients;
    }

    // Handle file upload
    let coverImageUrl = "";
    if (req.file) {
      coverImageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Create recipe
    const recipe = await Recipes.create({
      title,
      ingredients: ingredientsArr,
      instructions,
      time,
      category,
      coverImage: coverImageUrl,
      createdBy: req.user.id,
    });

    return res.status(201).json(recipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// ✅ Get all unique categories
const getCategories = async (req, res) => {
  try {
    const categories = await Recipes.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Edit recipe
const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    let coverImageUrl = recipe.coverImage;
    if (req.file) {
      coverImageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      { ...req.body, coverImage: coverImageUrl },
      { new: true }
    );

    return res.json(updatedRecipe);
  } catch (error) {
    console.error("Error editing recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    return res.json({ message: `${recipe.title} - deleted successfully` });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search recipes by title (case-insensitive)
const searchRecipes = async (req, res) => {
  try {
    const query = req.query.q || "";
    const recipes = await Recipes.find({
      title: { $regex: query, $options: "i" } // case-insensitive search
    }).populate("createdBy", "username");

    return res.json(recipes);
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get only current user's recipes
const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken
    const recipes = await Recipes.find({ createdBy: userId })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    return res.json(recipes);
  } catch (error) {
    console.error("Error fetching my recipes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  searchRecipes,
  upload,
  getMyRecipes,
  getCategories, // ✅ added this
};
