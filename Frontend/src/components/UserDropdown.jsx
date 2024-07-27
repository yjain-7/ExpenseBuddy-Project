import React, { useState } from 'react';

function UserDropdown({ users, onUserSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleUserSelect = (event, user) => {
    event.preventDefault(); // Prevent any default behavior
    setSelectedUser(user);
    onUserSelected(user.userId); // Pass the selected user's id to the parent
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {selectedUser ? `Paid by ${selectedUser.name}` : 'Select User'}
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul className="py-1 divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id}>
                <button
                  onClick={(event) => handleUserSelect(event, user)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {user.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
