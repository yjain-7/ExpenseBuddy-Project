import Card from "../components/Card";
import InputField from "../components/InputField";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form validation logic here, setting error if needed
    setError("Invalid form submission"); // Example error
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block">
        <Card />
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center text-2xl font-extrabold text-gray-700 mb-1 pb-3">
            SignUp Page
          </div>
          <div className="flex justify-center pb-2 font-semibold">
            Already have an account?
            <Link to="/" className="px-2 underline">Login</Link>
          </div>
          <InputField
            header="First name"
            placeholder="First name"
            type="text"
            name="firstName"
            value={firstName}
            onChange={handleInputChange}
          />
          <InputField
            header="Last name"
            placeholder="Last name"
            type="text"
            name="lastName"
            value={lastName}
            onChange={handleInputChange}
          />
          <InputField
            header="Email Address"
            placeholder="Enter your email"
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
          />
          <InputField
            header="Password"
            placeholder="Enter your password"
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
