import React, { useState } from 'react';

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    'https://via.placeholder.com/600x400?text=Screenshot+1',
    'https://via.placeholder.com/600x400?text=Screenshot+2',
    'https://via.placeholder.com/600x400?text=Screenshot+3',
    // Add more image URLs as needed
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-3">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-4 flex justify-center">About Expense-Buddy</h1>
          <div className='text-xl font-semibold'>
          <p className="text-gray-700 mb-4">
          Welcome to Expense-Buddy! Our project is designed to simplify your group expenses by allowing users to create groups, add expenses, and easily settle and simplify debts. With a user-friendly interface and powerful features, managing shared expenses and reducing debt complexity has never been easier.
          </p>
          <p className="text-gray-700 mb-4">
            Whether you're managing expenses with friends, family, or colleagues,
            Expense-Buddy ensures that everyone stays on the same page and
            transactions are handled efficiently.
          </p>
          <p className="text-gray-700 mb-6">
            For more information or to get in touch, feel free to connect with me
            through the links below:
          </p>
          </div>
          <div className="flex space-x-4 justify-center mb-8">
            <a
              href="https://www.linkedin.com/in/yjain7302/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              <img
                src="src/assets/icons8-linkedin-48.png"
                alt="LinkedIn"
                className="inline-block"
              />
            </a>
            <a
              href="https://github.com/yjain-7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline"
            >
              <img
                src='src/assets/icons8-github-50.png'
                alt="GitHub"
                className="inline-block"
              />
            </a>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
