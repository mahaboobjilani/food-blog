import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/recipes/categories/list`);
        setCategories(res.data.sort());
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <li className="dropdown">
      <span className="dropdown-title">Category ▾</span>
      <ul className="dropdown-menu">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li key={cat}>
              <NavLink to={`/category/${cat}`}>{cat}</NavLink>
            </li>
          ))
        ) : (
          <li>No categories</li>
        )}
      </ul>
    </li>
  );
};

export default Category;
