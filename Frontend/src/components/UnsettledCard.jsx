import React from "react";

const UnsettledCard = ({ unsettled }) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md flex justify-between items-center">
      <div>
        <p className="font-semibold">{unsettled.owedBy} owes {unsettled.paidBy} ₹{unsettled.amount}</p>
      </div>
      <div>
        <button className="px-4 py-2 bg-logo rounded hover:bg-logo-500">
          Settle
        </button>
      </div>
    </div>
  );
};

export default UnsettledCard;
