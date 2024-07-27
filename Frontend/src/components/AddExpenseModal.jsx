import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import EqualSplit from "./EqualSplit";
import UnequalSplit from "./UnequalSplit";

export default function AddExpenseModal({ auth, onClose, usersList }) {
  const [title, setTitle] = useState("Movie Tickets");
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [description, setDescription] = useState(
    "Movie tickets for Deadpool and Wolverine"
  );
  const [splitType, setSplitType] = useState("equal");
  const [splitData, setSplitData] = useState(null);

  const navigate = useNavigate();

  const handleUserSelected = (userId) => {
    setSelectedUserId(userId);
    console.log("Selected user ID:", userId);
  };

  const handleEqualSplitChange = (selectedUsers) => {
    setSplitData({
      type: "equal",
      users: selectedUsers,
      amount: amount / selectedUsers.length,
    });
    console.log("Inside Equal Split " + JSON.stringify(selectedUsers));
  };

  const handleUnequalSplitChange = (selectedUserAmounts) => {
    setSplitData({
      type: "unequal",
      users: selectedUserAmounts,
    });

    console.log(selectedUserAmounts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with split data:", splitData);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-start pt-20"
    >
      <div className="bg-logo rounded-xl p-6 flex flex-col gap-5 items-center mx-4 text-black max-w-lg w-full max-h-[90vh] overflow-auto scrollbar-hidden">
        <button onClick={onClose} className="place-self-end">
          <X size={30} />
        </button>
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold text-center">
            Add an Expense
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              required
              className="w-full px-4 py-3 border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              required
              className="w-full px-4 py-3 border-gray-300 rounded-md mt-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter Total Amount"
              required
              className="w-full px-4 py-3 border-gray-300 rounded-md mt-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="mt-4">
              <UserDropdown
                users={usersList}
                onUserSelected={handleUserSelected}
              />
            </div>

            <p>Selected User ID: {selectedUserId}</p>

            <div className="mt-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="splitType"
                  value="equal"
                  checked={splitType === "equal"}
                  onChange={() => setSplitType("equal")}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Split Equally</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="splitType"
                  value="unequal"
                  checked={splitType === "unequal"}
                  onChange={() => setSplitType("unequal")}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Split Unequally</span>
              </label>
            </div>

            {splitType === "equal" && (
              <EqualSplit users={usersList} onEqualSplitChange={handleEqualSplitChange} amount={amount} />
            )}

            {splitType === "unequal" && (
              <UnequalSplit users={usersList} onUnequalSplitChange={handleUnequalSplitChange} amount={amount} />
            )}

            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-black text-white"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
