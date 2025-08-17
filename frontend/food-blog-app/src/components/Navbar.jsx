import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import InputForm from './InputForm.jsx';
import Model from './Model.jsx';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    let token = localStorage.getItem("token");
    const [isLogin, setIsLogin] = useState(token ? false : true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        setIsLogin(token ? false : true);
    }, [token]);

    const checkLogin = () => {
        if (token) {
            // Logout
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLogin(true);

            // 🔥 force trigger storage event so RecipeItems updates instantly
            window.dispatchEvent(new Event("storage"));
        } else {
            // Open login modal
            setIsOpen(true);
        }
    };

    return (
        <>
            <header>
                <h2>Food Blog</h2>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li onClick={() => isLogin && setIsOpen(true)}>
                        <NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
                    </li>
                    <li onClick={() => isLogin && setIsOpen(true)}>
                        <NavLink to={!isLogin ? "/myFav" : "/"}>Favourites</NavLink>
                    </li>
                    <li onClick={checkLogin}>
                        <p className="login">
                            {isLogin ? "Login" : "Logout"}{user?.email ? ` (${user?.email})` : ""}
                        </p>
                    </li>
                </ul>
            </header>

            {isOpen && (
                <Model onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={() => setIsOpen(false)} />
                </Model>
            )}
        </>
    );
};

export default Navbar;
