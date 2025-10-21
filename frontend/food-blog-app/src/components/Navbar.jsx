import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import '../styles/Navbar.css';
import InputForm from "./InputForm.jsx";
import Model from "./Model.jsx";

const defaultCategories = ["Tiffins", "Nonveg", "Vegetarian","Fastfoods","Snack", "Dessert","Sweets"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLogin, setIsLogin] = useState(!!user);
  const [categories] = useState(defaultCategories);
const navigate = useNavigate(); 

  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      setUser(currentUser);
      setIsLogin(!!currentUser);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const checkLogin = () => {
    if (user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLogin(false);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <header>
        <h2>Recipe Hub</h2>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/menu">Menu</NavLink></li> {/* ✅ New Menu link */}

          {/* Category Dropdown */}
          <li className="dropdown">
            <span className="dropdown-title">Categories ▾</span>
            <ul className="dropdown-menu">
              {categories.map((cat) => (
                <li key={cat}>
                  <NavLink to={`/category/${cat}`}>{cat}</NavLink>
                </li>
              ))}
            </ul>
          </li>

          {isLogin && (
            <>
              <li><NavLink to="/myRecipe">My Recipes</NavLink></li>
              <li><NavLink to="/myFav">Favorites</NavLink></li>
            </>
          )}

          <li onClick={checkLogin}>
            <p className="login">{isLogin ? `Logout (${user?.username})` : "Login"}</p>
          </li>
        </ul>
      </header>

      {isOpen && (
        <Model onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Model>
      )}
    </>
  );
};

export default Navbar;
