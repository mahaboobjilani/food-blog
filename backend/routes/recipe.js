// const express = require("express");
// const {getRecipes, getRecipe,addRecipe,editRecipe,deleteRecipe,upload}= require("../controller/recipe");
// const verifyToken=require("../middleware/auth.js")
// const router=express.Router();

// router.get("/allRecipies",getRecipes);
// router.get("/:id",getRecipe);
// router.post("/", upload.single("file"), verifyToken,addRecipe);

// router.put("/:id",upload.single("file"),editRecipe);
// router.delete("/:id",deleteRecipe);

// module.exports = router;

const express = require("express");
const {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth.js");

const router = express.Router();

router.get("/allRecipies", getRecipes);
router.get("/:id", getRecipe);
router.post("/", upload.single("file"), verifyToken, addRecipe);
router.put("/:id", upload.single("file"), editRecipe);
router.delete("/:id", deleteRecipe);

module.exports = router;
