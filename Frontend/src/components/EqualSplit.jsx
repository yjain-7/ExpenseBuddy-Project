import { useState } from "react";

export default function EqualSplit({ users, onEqualSplitChange, amount }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [splitAmount, setSplitAmount] = useState(amount || 0);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSplitChange = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to split with.");
      return;
    }

    const splitAmountPerUser = amount / selectedUsers.length;

    const splitData = selectedUsers.map((userId) => ({
      owedBy:userId,
      amount: splitAmountPerUser
    }));

    onEqualSplitChange(splitData);
  };

  const handleAmountChange = (event) => {
    const newAmount = parseFloat(event.target.value);
    if (isNaN(newAmount)) {
      alert("Please enter a valid amount.");
      return;
    }
    setSplitAmount(newAmount);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Split Equally</h2>
      <div className="overflow-y-auto flex flex-col">
      {users.map((user) => (
        <div key={user.userId} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={user.userId}
            checked={selectedUsers.includes(user.userId)}
            onChange={() => handleUserSelection(user.userId)}
            className="mr-2"
          />
          <label htmlFor={user.userId} className="mr-4">{user.name}</label>
        </div>
      ))}
        </div>

      <button
        onClick={handleSplitChange}
        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
        disabled={selectedUsers.length === 0}
      >
        Confirm Split
      </button>
    </div>
  );
}
