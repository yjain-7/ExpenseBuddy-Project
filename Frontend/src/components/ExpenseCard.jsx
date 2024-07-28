import React, { useState } from "react";

const ExpenseCard = ({ expense }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleEdit = () => {
    // Function to handle edit action
    console.log("Edit button clicked");
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{expense.title}</h2>
          <h2 className="text-l font-semibold">{expense.description}</h2>
          <p>Paid by: {expense.paidBy}</p>
          <p>Amount: ₹{expense.amount}</p>
        </div>
        <div>
          <button onClick={handleToggle} className="text-xl">
            {isOpen ? '▲' : '▼'}
          </button>
        </div>
      </div>
      <p className="text-right text-sm text-gray-500 mt-2">
        Created at: {new Date(expense.date).toLocaleString()}
      </p>
      {isOpen && (
        <div className="mt-4 flex items-start">
          <div className="flex-1">
            <h3 className="font-semibold">Debts:</h3>
            <ul>
              {expense.debts.map((debt, index) => (
                <li key={index}>
                  {debt.owedBy} owes ₹{debt.amount}
                </li>
              ))}
            </ul>
          </div>
          <div className="ml-4">
            <button 
              onClick={handleEdit} 
              className="mt-8 p-2 pl-4 pr-4 bg-logo rounded hover:bg-logo"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
