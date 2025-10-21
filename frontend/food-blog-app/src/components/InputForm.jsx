import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/FormControl.css';

const API_URL = import.meta.env.VITE_BASE_URL;

const InputForm = ({ setIsOpen }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "signup" : "login";
      const payload = isSignup ? { username, email, password } : { email, password };

      const res = await axios.post(`${API_URL}/${endpoint}`, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Notify other components
      window.dispatchEvent(new Event("storage"));

      // ✅ Close modal after login/signup
      if (setIsOpen) setIsOpen(false);

      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h2>{isSignup ? "Signup" : "Login"}</h2>
      <form className="form" onSubmit={handleSubmit}>
        {isSignup && (
          <div className="form-control">
            <label>Username</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-control">
          <label>Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label>Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isSignup ? "Signup" : "Login"}</button>

        {error && <h6 className="error">{error}</h6>}

        <p
          onClick={() => {
            setIsSignup(prev => !prev);
            setError(""); // clear error when toggling
          }}
          style={{ display: "block", marginTop: "10px", cursor: "pointer", color: "#307bbd" }}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
        </p>
      </form>
    </div>
  );
};

export default InputForm;
