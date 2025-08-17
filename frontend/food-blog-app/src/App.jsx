import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import MainNavigation from "./components/MainNavigation";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from "./pages/EditRecipe";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";


const getAllRecipes=async()=>{
  let allRecipes=[]
  await axios.get('https://food-blog-backend-delta.vercel.app/recipe/allRecipies').then(res=>{
    allRecipes=res.data
  })
  return allRecipes
}
const getMyRecipes=async()=>{
  let user=JSON.parse(localStorage.getItem("user"))
  let allRecipes=await getAllRecipes()
  return allRecipes.filter(item=>item.createdBy===user._id)
}
const getFavRecipes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const allFavs = JSON.parse(localStorage.getItem("fav")) || [];

  if (!user) return []; // no user logged in

  // only return recipes favorited by this user
  return allFavs.filter(fav => fav.userId === user._id);
};

const getRecipeById = async ({ params }) => {
  const res = await axios.get(`https://food-blog-backend-delta.vercel.app/recipe/${params.id}`);
  return res.data;
};


const router=createBrowserRouter([
  {path:'/',element:<MainNavigation/>,children:[
  {path:'/',element:<Home/>,loader:getAllRecipes},
  {path:'/myRecipe',element:<Home/>,loader:getMyRecipes},
  {path:'/myFav',element:<Home/>,loader:getFavRecipes},
  {path:'/addRecipe',element:<AddFoodRecipe/>},
  {path:'/editRecipe/:id',element:<EditRecipe/>},
  { path: '/recipe/:id', element: <RecipeDetails />, loader: getRecipeById }

 

  ]}
])



const App = () => {
  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    </>
  );
}



export default App;
