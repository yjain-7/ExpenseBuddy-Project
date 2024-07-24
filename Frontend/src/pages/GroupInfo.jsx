import React from "react";
import ExpenseCard from "../components/ExpenseCard";
import UnsettledCard from "../components/UnsettledCard";
import { useLocation } from "react-router-dom";

export const GroupInfo = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const name = searchParams.get('name');
  const description = searchParams.get('description');
  const groupCode = searchParams.get('groupCode');
  const createdBy = searchParams.get('createdBy');
  const usersList = JSON.parse(searchParams.get('usersList') || '[]');
  const expenseList = JSON.parse(searchParams.get('expenseList') || '[]');
  const unsettled = JSON.parse(searchParams.get('unsettled') || '[]');

  if (!name || !description || !groupCode || !createdBy) {
    return <div>No group information available.</div>;
  }

  return (
    <div className="h-screen overflow-hidden">
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
          <div>Pending Transaction Section user related</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 h-[calc(100%-120px)]">
        <div className="hidden md:block overflow-y-auto p-2">
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

export default GroupInfo;
