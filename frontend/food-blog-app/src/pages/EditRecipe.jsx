import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/EditRecipe.css';

const API_URL = import.meta.env.VITE_BASE_URL;

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch recipe data on mount
    useEffect(() => {
        const getData = async () => {
            await axios.get(`${API_URL}/recipe/${id}`)
                .then(response => {
                    let res = response.data;
                    setRecipeData({
                        title: res.title,
                        ingredients: res.ingredients.join(','),
                        instructions: res.instructions,
                        time: res.time
                    });
                });
        };
        getData();
    }, [id]);

    // Handle input changes
    const onHandleChange = (e) => {
        let val =
            e.target.name === "ingredients"
                ? e.target.value.split(",")
                : e.target.name === "file"
                    ? e.target.files[0]
                    : e.target.value;

        setRecipeData(pre => ({ ...pre, [e.target.name]: val }));
    };

    // Handle form submit
    const onHandleSubmit = async (e) => {
        e.preventDefault();
        console.log(recipeData);
        await axios.put(`${API_URL}/recipe/${id}`, recipeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': 'bearer ' + localStorage.getItem("token")
            }
        })
            .then(() => navigate("/myRecipe"));
    };

    return (
        <div className='edit-recipe-wrapper'>
            <div className='edit-recipe-form'>
                <h2>Edit Recipe</h2>
                <form onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title</label>
                        <input
                            type="text"
                            className='input'
                            name="title"
                            value={recipeData.title || ""}
                            onChange={onHandleChange}
                        />
                    </div>

                    <div className='form-control'>
                        <label>Time</label>
                        <input
                            type="text"
                            className='input'
                            name="time"
                            value={recipeData.time || ""}
                            onChange={onHandleChange}
                        />
                    </div>

                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea
                            className='input-textarea'
                            name="ingredients"
                            rows="5"
                            value={recipeData.ingredients || ""}
                            onChange={onHandleChange}
                        />
                    </div>

                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea
                            className='input-textarea'
                            name="instructions"
                            rows="5"
                            value={recipeData.instructions || ""}
                            onChange={onHandleChange}
                        />
                    </div>

                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input
                            type="file"
                            className='input'
                            name="file"
                            onChange={onHandleChange}
                        />
                    </div>

                    <button type="submit">Edit Recipe</button>
                </form>
            </div>
        </div>
    );
}
