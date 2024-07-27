import { useState, useEffect } from "react";

export default function UnequalSplit({ users, onUnequalSplitChange, amount }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userAmounts, setUserAmounts] = useState({});
  const [isAmountValid, setIsAmountValid] = useState(true);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleAmountChange = (userId, value) => {
    const amount = parseFloat(value) || 0;
    setUserAmounts((prevAmounts) => ({
      ...prevAmounts,
      [userId]: amount,
    }));
  };

  const approximatelyEqual = (a, b, tolerance = 0.01) => {
    return Math.abs(a - b) < tolerance;
  };

  useEffect(() => {
    const totalAmount = selectedUsers.reduce(
      (sum, userId) => sum + (userAmounts[userId] || 0),
      0
    );
    setIsAmountValid(approximatelyEqual(totalAmount, amount));
  }, [selectedUsers, userAmounts, amount]);

  const handleSplitChange = () => {
    if (isAmountValid) {
      const selectedUserAmounts = selectedUsers.map((userId) => ({
        owedBy: userId,
        amount: userAmounts[userId] || 0,
      }));
      onUnequalSplitChange(selectedUserAmounts);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Split Unequally</h2>
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
          {selectedUsers.includes(user.userId) && (
            <input
              type="number"
              value={userAmounts[user.userId] || ""}
              onChange={(e) => handleAmountChange(user.userId, e.target.value)}
              className="p-1 border border-gray-300 rounded"
              placeholder="Amount"
            />
          )}
        </div>
      ))}
      {!isAmountValid && <p className="text-red-500 mb-2">Amounts do not sum up to the total amount.</p>}
      <button
        onClick={handleSplitChange}
        disabled={!isAmountValid}
        className={`px-4 py-2 rounded ${
          isAmountValid ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Confirm Split
      </button>
    </div>
  );
}
