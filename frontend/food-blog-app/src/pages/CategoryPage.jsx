import axios from "axios";
import { useEffect, useState } from "react";
import { FaClock, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/category.css';

const API_URL = import.meta.env.VITE_BASE_URL;

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || null;

  // Load favorites for current user
  const [favorites, setFavorites] = useState(() => {
    const storedFavs = JSON.parse(localStorage.getItem("fav")) || [];
    return storedFavs
      .filter(f => f.userId === currentUser?._id)
      .map(f => f._id);
  });

  // Fetch recipes for category
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/recipe?category=${categoryName}`);
        setRecipes(res.data);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [categoryName]);

  // Search handler
  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const url = query
      ? `${API_URL}/recipe/search/title?q=${query}`
      : `${API_URL}/recipe?category=${categoryName}`;

    try {
      const res = await axios.get(url);
      const filtered = res.data.filter(r => r.category === categoryName && r.title.toLowerCase().includes(query));
      setRecipes(filtered);
    } catch (err) {
      console.error("Error searching recipes:", err);
    }
  };

  // Navigate to recipe
  const goToRecipe = (id) => {
    navigate(`/recipe/${id}`);
    window.scrollTo(0, 0);
  };

  // Toggle favorite
  const toggleFavorite = (recipe) => {
    if (!currentUser) return;

    let favs = JSON.parse(localStorage.getItem("fav")) || [];
    const favItem = { ...recipe, userId: currentUser._id };

    const exists = favs.some(f => f._id === recipe._id && f.userId === currentUser._id);
    favs = exists
      ? favs.filter(f => !(f._id === recipe._id && f.userId === currentUser._id))
      : [...favs, favItem];

    localStorage.setItem("fav", JSON.stringify(favs));
    setFavorites(favs.filter(f => f.userId === currentUser._id).map(f => f._id));
  };

  return (
    <div className="category-page container">
      <h2 className="category-title">{categoryName} Recipes</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search in ${categoryName} recipes...`}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p className="loading">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="no-recipes">No recipes found in this category.</p>
      ) : (
        <div className="recipe-list">
          {recipes.map(r => (
            <div key={r._id} className="recipe-card">
              <div className="recipe-image-wrapper">
                {r.coverImage ? (
                  <img src={r.coverImage} alt={r.title} className="recipe-image" />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>

              <div className="recipe-content">
                <h3>{r.title} ~By {r.createdBy.username}</h3>

                <p><strong>Category:</strong> {r.category}</p>

                {/* Timer and Favorite inline */}
                <div className="info-row">
                  {(
                    <span className="timer">
                      <FaClock /> {r.time} mins
                    </span>
                  )}

                  <span
                    className="favorite-icon"
                    onClick={() => toggleFavorite(r)}
                  >
                    {favorites.includes(r._id) ? <FaHeart color="red"/> : <FaRegHeart />}
                  </span>
                </div>

             

                <button
                  className="details-btn"
                  onClick={() => goToRecipe(r._id)}
                >
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

export default CategoryPage;
