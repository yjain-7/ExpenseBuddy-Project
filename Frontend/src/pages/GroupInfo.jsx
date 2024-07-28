import { useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import UnsettledCard from "../components/UnsettledCard";
import { useLocation } from "react-router-dom";
import AddExpenseModal from "../components/AddExpenseModal";

export const GroupInfo = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const name = searchParams.get("name");
  const description = searchParams.get("description");
  const groupCode = searchParams.get("groupCode");
  const createdBy = searchParams.get("createdBy");
  const usersList = JSON.parse(searchParams.get("usersList") || "[]");
  const [expenseList, setExpenseList] = useState(
    JSON.parse(searchParams.get("expenseList") || "[]")
  );
  const [unsettled, setUnsettled] = useState(
    JSON.parse(searchParams.get("unsettled") || "[]")
  );
  const [showUsers, setShowUsers] = useState(false);
  const [showExpenses, setShowExpenses] = useState(true); // Default to show expenses
  const [showUnsettled, setShowUnsettled] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const token = localStorage.getItem("authToken");

  const openModal = () => {
    setExpenseModal(true);
  };

  const closeModal = () => {
    setExpenseModal(false);
  };

  if (!name || !description || !groupCode || !createdBy) {
    return <div>No group information available.</div>;
  }

  const toggleUsers = () => {
    setShowUsers(true);
    setShowExpenses(false);
    setShowUnsettled(false);
  };

  const toggleExpenses = () => {
    setShowUsers(false);
    setShowExpenses(true);
    setShowUnsettled(false);
  };

  const toggleUnsettled = () => {
    setShowUsers(false);
    setShowExpenses(false);
    setShowUnsettled(true);
  };

  return (
    <div className="h-screen overflow-hidden relative">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
            <p className="text-gray-600">{description}</p>
            <h2 className="text-lg font-semibold text-gray-700">
              Group Code: {groupCode}
            </h2>
            <p className="text-gray-600">Created By: {createdBy}</p>
          </div>
          <div className="flex flex-col">
            <div>Pending Transaction Section user related</div>
            <div className="flex flex-auto space-x-4 pt-5 justify-end items-end">
              <Button onClick={openModal} text="Add Expense" />
              <Button text="Simplify" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Headers */}
      <div className="md:hidden flex justify-around my-4">
        <button
          className={`flex-1 text-center py-2 ${showUsers ? 'bg-gray-200' : 'bg-white'} rounded`}
          onClick={toggleUsers}
        >
          User List
        </button>
        <button
          className={`flex-1 text-center py-2 ${showExpenses ? 'bg-gray-200' : 'bg-white'} rounded`}
          onClick={toggleExpenses}
        >
          Expense List
        </button>
        <button
          className={`flex-1 text-center py-2 ${showUnsettled ? 'bg-gray-200' : 'bg-white'} rounded`}
          onClick={toggleUnsettled}
        >
          Unsettled List
        </button>
      </div>

      {/* Content Sections */}
      <div className="hidden md:grid md:grid-cols-3 gap-3 mt-4 h-[calc(100%-120px)]">
        <div className="overflow-y-auto p-2">
          {usersList.length > 0 ? (
            usersList.map((userData) => (
              <UserListCard key={userData.userId} name={userData.name} />
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>

        <div className="overflow-y-auto p-2">
          {expenseList.length > 0 ? (
            expenseList.map((expense) => (
              <ExpenseCard key={expense._id} expense={expense} />
            ))
          ) : (
            <p>No expenses found.</p>
          )}
        </div>

        <div className="overflow-y-auto p-2">
          {unsettled.length > 0 ? (
            unsettled.map((debt) => (
              <UnsettledCard key={debt.id} unsettled={debt} />
            ))
          ) : (
            <p>No settlements found.</p>
          )}
        </div>
      </div>

      {/* Mobile Content Sections */}
      <div className="md:hidden mt-4">
        {showUsers && (
          <div className="overflow-y-auto p-2">
            {usersList.length > 0 ? (
              usersList.map((userData) => (
                <UserListCard key={userData.userId} name={userData.name} />
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}

        {showExpenses && (
          <div className="overflow-y-auto p-2">
            {expenseList.length > 0 ? (
              expenseList.map((expense) => (
                <ExpenseCard key={expense._id} expense={expense} />
              ))
            ) : (
              <p>No expenses found.</p>
            )}
          </div>
        )}

        {showUnsettled && (
          <div className="overflow-y-auto p-2">
            {unsettled.length > 0 ? (
              unsettled.map((debt) => (
                <UnsettledCard key={debt.id} unsettled={debt} />
              ))
            ) : (
              <p>No settlements found.</p>
            )}
          </div>
        )}
      </div>

      {expenseModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <AddExpenseModal
              auth={token}
              onClose={closeModal}
              usersList={usersList}
              groupCode={groupCode}
              setExpenseList={setExpenseList}
              setUnsettled={setUnsettled}
            />
          </div>
        </>
      )}
    </div>
  );
};

function UserListCard({ name }) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      <p className="text-lg font-semibold">{name}</p>
    </div>
  );
}

function Button({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className="bg-logo px-4 py-2 rounded-lg font-semibold text-lg"
    >
      {text}
    </button>
  );
}

export default GroupInfo;
