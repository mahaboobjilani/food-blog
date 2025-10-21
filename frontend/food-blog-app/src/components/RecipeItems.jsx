import axios from "axios";
import { useEffect, useState } from "react";
import { BsStopwatchFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import '../styles/RecipeItems.css';

const API_URL = import.meta.env.VITE_BASE_URL;

const RecipeItems = () => {
  const recipesData = useLoaderData(); // from router loader
  const [allRecipes, setAllRecipes] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const isMyRecipe = pathname.startsWith("/myRecipe");
  const isFavPage = pathname.startsWith("/myFav");
  const isCategoryPage = pathname.startsWith("/category/");

  // Initialize recipes
  useEffect(() => {
    setAllRecipes(recipesData || []);
  }, [recipesData]);

  // Initialize favorites
  const loadFavorites = () => {
    if (currentUser) {
      const storedFavs = JSON.parse(localStorage.getItem("fav")) || [];
      setFavItems(storedFavs.filter(f => f.userId === currentUser._id));
    } else {
      setFavItems([]);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [currentUser]);

  // Listen to localStorage changes to sync favorites across pages
  useEffect(() => {
    const handleStorageChange = () => {
      loadFavorites();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

const onDelete = async (id) => {
  try {
    await axios.delete(`${API_URL}/recipe/${id}`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    });

    // 1️⃣ Remove recipe locally
    setAllRecipes(prev => prev.filter(r => r._id !== id));

    // 2️⃣ Remove from localStorage favorites (all users)
    let favs = JSON.parse(localStorage.getItem("fav")) || [];
    favs = favs.filter(f => f._id !== id);
    localStorage.setItem("fav", JSON.stringify(favs));

    // 3️⃣ Sync favorites UI
    loadFavorites();

    // 4️⃣ Trigger backend cleanup (optional if backend handles automatically)
    await axios.delete(`${API_URL}/favorites/deleteByRecipe/${id}`, {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    });

    // 5️⃣ Notify other tabs
    window.dispatchEvent(new Event("storage"));

  } catch (err) {
    console.error("Error deleting recipe:", err);
  }
};


  // Favorite/unfavorite
  const favRecipe = (item) => {
    if (!currentUser) return;
    let favs = JSON.parse(localStorage.getItem("fav")) || [];
    const favItemWithUser = { ...item, userId: currentUser._id };

    const exists = favs.some(f => f._id === item._id && f.userId === currentUser._id);
    favs = exists
      ? favs.filter(f => !(f._id === item._id && f.userId === currentUser._id))
      : [...favs, favItemWithUser];

    localStorage.setItem("fav", JSON.stringify(favs));
    loadFavorites(); // immediately update state
  };

  const goToRecipe = (id) => {
    navigate(`/recipe/${id}`);
    window.scrollTo(0, 0);
  };

  // Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    let filtered = [];
    if (isMyRecipe) {
      filtered = recipesData.filter(
        item => item.createdBy?._id === currentUser?._id && item.title.toLowerCase().includes(query)
      );
    } else if (isFavPage) {
      filtered = favItems.filter(item => item.title.toLowerCase().includes(query));
    } else if (isCategoryPage) {
      const categoryName = pathname.split("/category/")[1];
      filtered = recipesData.filter(
        item => item.category === categoryName && item.title.toLowerCase().includes(query)
      );
    } else {
      filtered = recipesData.filter(item => item.title.toLowerCase().includes(query));
    }

    setAllRecipes(filtered);
  };

  // Displayed list based on page
  const displayRecipes = isFavPage ? favItems : allRecipes;

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {displayRecipes.length === 0 ? (
        <p className="no-recipes">No recipes found.</p>
      ) : (
        <div className="card-container">
          {displayRecipes.map(item => (
            <div key={item._id} className="card">
              <img src={item.coverImage} alt={item.title} className="card-image" />
              <div className="card-body">
                <div className="title">
                  {item.title} ~by {item.createdBy?.username || "Unknown"}
                </div>

                {isMyRecipe ? (
                  <div className="action">
                    <Link to={`/editRecipe/${item._id}`} className="editIcon">
                      <FaEdit />
                    </Link>
                    <MdDelete onClick={() => onDelete(item._id)} className="deleteIcon" />
                  </div>
                ) : (
                  <div className="icons">
                    <FaHeart
                      onClick={() => favRecipe(item)}
                      className="heart-icon"
                      style={{ color: favItems.some(f => f._id === item._id) ? "red" : "" }}
                    />
                    <div className="timer">
                      <BsStopwatchFill className="timer-icon" /> {item.time} mins
                    </div>
                  </div>
                )}

                <button className="details-btn" onClick={() => goToRecipe(item._id)}>
                  Go to Recipe ➡      
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeItems;