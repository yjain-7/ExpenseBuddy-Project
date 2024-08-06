import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GroupInfo from "./pages/GroupInfo";
import UserInfo from "./pages/UserInfo";
import Navbar from "./components/Navbar";
import About from "./pages/About";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/userInfo",
      element: <UserInfo />,
    },
    {
      path: "/groupInfo",
      element: <GroupInfo />,
    },
    {
      path: "/about",
      element: <About />,
    }
  ]);

  return (
    <>
      <Navbar className="fixed w-full z-50 bg-white shadow-md" />
      <div className=""> {/* Adjust padding here to match the height of the Navbar */}
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
