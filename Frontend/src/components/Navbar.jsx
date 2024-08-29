import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Login", link: "/" },
    { id: 2, text: "Signup", link: "/signup" },
    { id: 3, text: "About", link: "/about" },
  ];

  return (
    <div className="bg-black flex justify-between items-center h-24 mx-auto px-4 text-white">
      {/* Logo */}
      <h1 className="w-full text-3xl font-bold text-logo">EXPENSE BUDDY</h1>

      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="text-lg font-semibold p-4 hover:bg-logosemidark rounded-xl m-2 cursor-pointer duration-300 hover:text-logo text-3xl"
          >
            <a href={item.link}>{item.text} </a>
          </li>
        ))}
      </ul>

      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      <ul
        className={
          nav
            ? "fixed z-50 md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "fixed z-50 top-0 bottom-0 left-[-100%] w-[60%] ease-in-out duration-500"
        }
      >
        <h1 className="w-full text-3xl font-bold text-logo m-4">
          Expense Buddy
        </h1>

        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border-b rounded-xl hover:bg-logo semidark duration-300 hover:text-logo cursor-pointer"
          >
            <a href={item.link}>{item.text} </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
