import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";
// import userData from "../data/user_data.json";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email: credentials.email,
        password: credentials.password,
      });

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.user.id);
      alert("Login successful!");
      navigate("/todo");
    } catch (error) {
      console.error("Error in logging in: ", error);
      alert(error);
    }

    // const user = userData[credentials.email]; // current user

    // if (user && credentials.password === user.password) {
    //   alert("Login successful!");
    //   sessionStorage.setItem("currentUser", credentials.email);
    //   navigate("/todo");
    // } else {
    //   setError("Invalid email or password");
    // }
  };

  return (
    <div className="container mt-5">
      <h2> Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 w-50">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={credentials.email}
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
            value={credentials.password}
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

        {error && <div className="text-danger mb-3">{error}</div>}

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
