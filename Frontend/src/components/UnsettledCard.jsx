import React from 'react';

const UnsettledCard = ({ unsettled, groupCode, setUnsettled }) => {
  const auth = localStorage.getItem('authToken');
  const handleSettle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://expensebuddy-backend-n7y9.onrender.com/api/expenses/settle', {
        method: 'DELETE',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupCode: groupCode, unsettledId: unsettled.id }),
      });
      if (response.ok) {
        // Assuming `setUnsettled` is a state setter for an array of unsettled expenses
        setUnsettled((prevUnsettled) => prevUnsettled.filter((item) => item.id !== unsettled.id));
        alert('Expense Settled');
      } else {
        alert('Error settling expense');
      }
    } catch (err) {
      console.error(err);
      alert('Error settling expense');
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md flex justify-between items-center">
      <div>
        <p className="font-semibold">{unsettled.owedBy} owes {unsettled.paidBy} ₹{unsettled.amount}</p>
      </div>
      <div>
        <button
          onClick={handleSettle}
          className="px-4 py-2 bg-logo rounded hover:bg-logo-500"
        >
          Settle
        </button>
      </div>
    </div>
  );
};

export default UnsettledCard;
