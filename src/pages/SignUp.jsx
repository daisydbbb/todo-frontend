import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";
// import userData from "../data/user_data.json";
import axios from "axios";

// const existingUsers = { ...userData };

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Session save token and userId from response
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.user.id);

      alert("Sign up successful!");
      navigate("/todo");
    } catch (error) {
      console.error("Error in signing up: ", error);
      alert(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2> Create New Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 w-50">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 w-50">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 w-50">
          <label htmlFor="password">Password: </label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            {showPassword ? <FaRegEyeSlash /> : <MdOutlineRemoveRedEye />}{" "}
          </span>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
