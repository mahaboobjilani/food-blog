import { Link, useLoaderData } from 'react-router-dom';
import profileImg from '../assets/profile.png';
export default function RecipeDetails() {
    const recipe = useLoaderData()
    console.log(recipe)

    return (
        <>
            <div className='outer-container' >
                <div className='profile'>
                    <img src={profileImg} width="50px" height="50px" alt="profile" />
                    <h5>{recipe.email}</h5>
                </div>
                <h3 className='title'>{recipe.title}</h3>
                <img
                    src={`http://localhost:5000/images/${recipe.coverImage}`}
                    width="220px"
                    height="200px"
                    alt={recipe.title}
                />
                <div className='recipe-details'>
                    <div className='ingredients'>
                        <h4>Ingredients</h4>
                        <ul>
                            {recipe.ingredients.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='instructions'>
                        <h4>Instructions</h4>
                        <span>{recipe.instructions}</span>
                    </div>
                </div>

                {/* 👇 Add back link */}
                <div style={{ marginTop: "20px" }}>
                    <Link to="/">⬅ Back to Recipes</Link>
                </div>
            </div>
        </>
    )
}
