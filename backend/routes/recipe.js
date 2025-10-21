const express = require("express");
const router = express.Router();
const Recipes = require("../models/recipe"); // required for some routes
const {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  searchRecipes,
  upload,
  getMyRecipes,
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth");

// GET all recipes (optional category filter)
router.get("/", getRecipes); // supports ?category=CategoryName

// GET all unique categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Recipes.distinct("category");
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single recipe by id
router.get("/:id", getRecipe);

// GET search recipes by title
router.get("/search/title", searchRecipes); // query param: ?q=keyword

// GET current user's recipes
router.get("/myRecipes", verifyToken, getMyRecipes);

// POST add recipe
router.post("/", verifyToken, upload.single("file"), addRecipe);

// PUT edit recipe
router.put("/:id", verifyToken, upload.single("file"), editRecipe);

// DELETE recipe
router.delete("/:id", verifyToken, deleteRecipe);

module.exports = router;
