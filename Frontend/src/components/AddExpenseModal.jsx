import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import EqualSplit from "./EqualSplit";
import UnequalSplit from "./UnequalSplit";

export default function AddExpenseModal({ auth, onClose, usersList, groupCode, setExpenseList, setUnsettled }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [description, setDescription] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [splitData, setSplitData] = useState(null);
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleAddExpenseButton = (e) => {
    e.preventDefault();
    setIsDisabled(true);
    submitExpense();
  };

  const submitExpense = async () => {
    try {
      const BASEURL = import.meta.env.VITE_BASEURL;
      const url = `${BASEURL}expenses/addExpense`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          paidBy: selectedUserId,
          totalAmount: amount,
          groupCode: groupCode,
          debts: splitData.users,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message);
        setIsDisabled(false);
      } else {
        alert(data.message);
        setExpenseList(data.expenseList);
        setUnsettled(data.unsettled);
        onClose();
        setIsDisabled(false);
      }
    } catch (e) {
      console.log(e.message);
      setError("An error occurred while adding the expense. Please try again.");
      setIsDisabled(false);
    }
  };

  const handleUserSelected = (userId) => {
    setSelectedUserId(userId);
    console.log("Selected user ID:", userId);
  };

  const handleEqualSplitChange = (selectedUsers) => {
    setSplitData({
      type: "equal",
      users: selectedUsers,
    });
    console.log("Inside Equal Split " + JSON.stringify(selectedUsers));
  };

  const handleUnequalSplitChange = (selectedUserAmounts) => {
    setSplitData({
      type: "unequal",
      users: selectedUserAmounts,
    });

    console.log("Inside Unequal split: "+JSON.stringify(selectedUserAmounts));
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
