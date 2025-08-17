import axios from "axios";
import { useState } from "react";

const InputForm = ({ setIsOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let endPoint = isSignup ? "signup" : "login";

    try {
      const res = await axios.post(`http://localhost:5000/${endPoint}`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 Notify other components immediately (like RecipeItems & Navbar)
      window.dispatchEvent(new Event("storage"));

      setIsOpen(); // close modal
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleOnSubmit}>
        <div className="form-control">
          <label>Email</label>
          <input
            type="email"
            className="input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label>Password</label>
          <input
            type="password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isSignup ? "Signup" : "Login"}</button>
        <br />
        {error !== "" && <h6 className="error">{error}</h6>}
        <br />
        <p onClick={() => setIsSignup((pre) => !pre)}>
          {isSignup ? "Already have an Account" : "Create New Account"}
        </p>
      </form>
    </>
  );
};

export default InputForm;
