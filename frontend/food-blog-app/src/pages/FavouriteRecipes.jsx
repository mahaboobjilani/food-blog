import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import Model from "../components/Model";
import RecipeItems from "../components/RecipeItems";

const FavouriteRecipes = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const addRecipe = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/addRecipe");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
   

      {/* Modal for login/signup */}
      {isOpen && (
        <Model onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Model>
      )}

      {/* Recipe list */}
      <div className="recipe">
        <RecipeItems />
      </div>
    </>
  );
};

export default FavouriteRecipes;
