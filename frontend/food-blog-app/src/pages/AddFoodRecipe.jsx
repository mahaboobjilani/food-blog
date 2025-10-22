import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/AddRecipe.css';

const API_URL = import.meta.env.VITE_BASE_URL;

const AddFoodRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([
    "Tiffins",
    "Nonveg",
    "Snack",
    "Fastfoods",
    "Dessert",
    "Vegetarian",
    "Sweets"
  ]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/recipe/categories/list`);
        const merged = Array.from(new Set([...categories, ...res.data]));
        setCategories(merged.sort());
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("ingredients", JSON.stringify(ingredients.split(",")));
      formData.append("instructions", instructions);
      formData.append("time", time);
      formData.append("category", category);
      if (file) formData.append("file", file);

      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/recipe`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Recipe added successfully!");
      navigate("/myRecipe");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert("Failed to add recipe");
    }
  };

  return (
    <div className="add-recipe-wrapper">
      <div className="add-recipe-form">
        <h2>Add Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
          <textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Time (e.g., 30 mins)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodRecipe;
