import Card from "../components/Card";
import InputField from "../components/InputField";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const navigate = useNavigate();

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError(null);

    try {
      const BASEURL = import.meta.env.VITE_BASEURL;
      const response = await fetch(BASEURL + "users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const userInfo = data.userInfo;

      localStorage.setItem("authToken", userInfo.token);

      navigate("/userInfo", { state: { userInfo } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {showAlert && (
        <CustomAlert
          message="⚠️ Please Note: This website is hosted on a free service. If the backend has been inactive, the server may take up to 1 minute to respond for the first time. Thank you for your patience!"
          onClose={handleAlertClose}
        />
      )}
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center text-2xl font-extrabold text-gray-700 mb-1 pb-3">
            Login Page
          </div>
          <div className="flex justify-center pb-2 font-semibold">
            Don't have an account?
            <NavLink to="/signup" className="px-2 underline">
              SignUp
            </NavLink>
          </div>
          <InputField
            header="Email Address"
            placeholder="Enter your email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            header="Password"
            placeholder="Enter your password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          <div className="mt-10 font-bold text-gray-500">
            <div>Dummy accout</div>
            <div>email : user1@gmail.com</div>
            <div>password : 123456</div>
          </div>
        </form>
      </div>
      <div className="bg-logo hidden md:block">
        <Card />
      </div>
    </div>
  );
}
