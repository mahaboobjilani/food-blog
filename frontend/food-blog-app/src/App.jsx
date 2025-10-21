import axios from "axios";
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import MainNavigation from "./components/MainNavigation";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import CategoryPage from "./pages/CategoryPage";
import EditRecipe from "./pages/EditRecipe";
import FavouriteRecipes from "./pages/FavouriteRecipes";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import RecipeDetails from "./pages/RecipeDetails";
import Recipes from "./pages/Recipes";


const API_URL = import.meta.env.VITE_BASE_URL;

// Load all recipes
const getAllRecipes = async () => {
  const res = await axios.get(`${API_URL}/recipe/`);
  return res.data;
};

// Load only current user's recipes
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return [];
  
  const res = await axios.get(`${API_URL}/recipe/`);
  return res.data.filter(item => item.createdBy?._id === user._id);
};

// Load only current user's favorites
const getFavRecipes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const allFavs = JSON.parse(localStorage.getItem("fav")) || [];
  if (!user) return [];
  return allFavs.filter(fav => fav.userId === user._id);
};

// Load single recipe by id
const getRecipeById = async ({ params }) => {
  const res = await axios.get(`${API_URL}/recipe/${params.id}`);
  return res.data;
};

// Load recipes by category
const getRecipesByCategory = async ({ params }) => {
  const res = await axios.get(`${API_URL}/recipe?category=${params.categoryName}`);
  return res.data;
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainNavigation />,
    children: [
      { path: '/', element: <Home />, loader: getAllRecipes },
      { path: '/menu', element: <Menu />, loader: getAllRecipes  },  // ✅ NEW
      { path: '/myRecipe', element: <Recipes />, loader: getMyRecipes },
      { path: '/myFav', element: <FavouriteRecipes />, loader: getFavRecipes },
      { path: '/addRecipe', element: <AddFoodRecipe /> },
      { path: '/editRecipe/:id', element: <EditRecipe /> },
      { path: '/recipe/:id', element: <RecipeDetails />, loader: getRecipeById },
      { path: '/category/:categoryName', element: <CategoryPage />, loader: getRecipesByCategory },
    ],
  },
]);


const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;
