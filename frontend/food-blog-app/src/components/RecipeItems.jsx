import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsStopwatchFill } from 'react-icons/bs';
import { FaEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Link, useLoaderData, useNavigate } from "react-router";

const RecipeItems = () => {
  const recipes = useLoaderData();
  const [allRecipes, setAllRecipes] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const navigate = useNavigate();
  const path = window.location.pathname === "/myRecipe";

  // Load recipes from loader
  useEffect(() => {
    setAllRecipes(recipes);
  }, [recipes]);

  // Refresh favorites whenever user changes
  useEffect(() => {
    if (currentUser) {
      const storedFavs = JSON.parse(localStorage.getItem("fav")) ?? [];
      setFavItems(storedFavs.filter(f => f.userId === currentUser._id));
    } else {
      setFavItems([]); // no user => no favs
    }
  }, [currentUser]);

  // Listen to login/logout changes (from Navbar or other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user")) || null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const onDelete = async (id) => {
    await axios.delete(`https://food-blog-backend-delta.vercel.app/recipe/${id}`);
    setAllRecipes((recipes) => recipes.filter((recipe) => recipe._id !== id));

    // also remove from favorites
    const storedFavs = JSON.parse(localStorage.getItem("fav")) ?? [];
    const updatedFavs = storedFavs.filter((recipe) => recipe._id !== id);
    localStorage.setItem("fav", JSON.stringify(updatedFavs));
    setFavItems(updatedFavs.filter(f => f.userId === currentUser?._id));
  };

  const myRecipeDetails = (id) => {
    navigate(`/recipe/${id}`);
  };

  const favRecipe = (item) => {
    if (!currentUser) return; // do nothing if not logged in

    let favs = JSON.parse(localStorage.getItem("fav")) ?? [];
    const favItemWithUser = { ...item, userId: currentUser._id };

    const exists = favs.some(
      (recipe) => recipe._id === item._id && recipe.userId === currentUser._id
    );

    if (exists) {
      favs = favs.filter(
        (recipe) =>
          !(recipe._id === item._id && recipe.userId === currentUser._id)
      );
    } else {
      favs.push(favItemWithUser);
    }

    // save in localStorage
    localStorage.setItem("fav", JSON.stringify(favs));

    // 🔥 immediately update state for current user
    setFavItems(favs.filter(f => f.userId === currentUser._id));
  };

  return (
    <div className="card-container">
      {allRecipes?.map((item, index) => (
        <div key={index} className="card">
          <img
            src={`https://food-blog-backend-delta.vercel.app/images/${item.coverImage}`}
            width="120px"
            height="100px"
          />
          <div className="card-body">
            <div
              className="title"
              onClick={() => myRecipeDetails(item._id)}
              style={{ cursor: "pointer" }}
            >
              {item.title}
            </div>
            <div className="icons">
              <div className="timer">
                <BsStopwatchFill />
                {item.time}
              </div>

              {!path ? (
                <FaHeart
                  onClick={() => favRecipe(item)}
                  style={{
                    color: favItems.some((res) => res._id === item._id)
                      ? "red"
                      : "",
                  }}
                />
              ) : (
                <div className="action">
                  <Link to={`/editRecipe/${item._id}`} className="editIcon">
                    <FaEdit />
                  </Link>
                  <MdDelete
                    onClick={() => onDelete(item._id)}
                    className="deleteIcon"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeItems;
