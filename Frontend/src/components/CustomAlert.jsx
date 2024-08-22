import { useState, useEffect } from "react";

function CustomAlert({ message, onClose }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(5); // Set initial countdown time (in seconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setIsButtonDisabled(false); // Enable button when countdown finishes
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg text-center">
        <p className="text-left">{message}</p>
        <button
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onClose}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? `OK (${countdown})` : "OK"}
        </button>
      </div>
    </div>
  );
}

export default CustomAlert;
