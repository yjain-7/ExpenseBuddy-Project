import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaGithub className="w-6 h-6" />
          </a>
        </div>
        <div>
          <a
            href="/about"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            About
          </a>
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Expense Buddy | Track & Simplify
        </div>
      </div>
    </footer>
  );
};

export default Footer;
