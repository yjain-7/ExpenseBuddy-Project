import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: 'Login', link: '/' },
    { id: 2, text: 'Signup', link: '/signup' },
    { id: 3, text: 'About', link: '/about' },
  ];

  return (
    <div className='bg-black flex justify-between items-center h-24 mx-auto px-4 text-white'>
      <h1 className='w-full text-3xl font-bold text-logo'>EXPENSE BUDDY</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-logosemidark rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
          >
            <Link to={item.link}>{item.text}</Link>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed z-50 md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'fixed z-50 top-0 bottom-0 left-[-100%] w-[60%] ease-in-out duration-500'
        }
      >
        <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>EXPENSE BUDDY</h1>

        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b rounded-xl hover:bg-logosemidark duration-300 hover:text-black cursor-pointer border-gray-600'
          >
            <Link to={item.link} onClick={handleNav}>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
