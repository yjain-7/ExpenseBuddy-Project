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
  const [successMessage, setSuccessMessage] = useState(""); // Add state for success message

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation logic here, setting error if needed
    if (!email || !password || !firstName) {
      setError("All fields are required except last name.");
      return;
    }

    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    try {
      const response = await fetch('https://expensebuddy-backend-n7y9.onrender.com/api/users/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const userInfo = result.userInfo; // Adjust this according to your API response
      console.log(userInfo);
      setSuccessMessage("Account created successfully! Now you can log in."); // Set success message
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Failed to sign up. Please try again.');
      console.error('Error:', error);
    }
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
          {successMessage && (
            <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
              {successMessage}
            </div>
          )}
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
