import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GroupInfoCard({ title, description, groupCode, auth }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCardClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const BASEURL = import.meta.env.VITE_BASEURL
      const url = new URL(BASEURL+"groups/getGroup");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupCode }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch group data: ${response.statusText}`);
      }

      const group = await response.json();
      const groupInfo = group.group;

      // Navigate to the groupInfo page with URL parameters
      const searchParams = new URLSearchParams();
      searchParams.append('name', groupInfo.name);
      searchParams.append('description', groupInfo.description);
      searchParams.append('groupCode', groupInfo.groupCode);
      searchParams.append('createdBy', groupInfo.createdBy);
      searchParams.append('usersList', JSON.stringify(groupInfo.usersList));
      searchParams.append('expenseList', JSON.stringify(groupInfo.expenseList));
      searchParams.append('unsettled', JSON.stringify(groupInfo.unsettled));
      searchParams.append('activites', JSON.stringify(groupInfo.activities))

      navigate(`/groupInfo?${searchParams.toString()}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-logo shadow-md rounded-lg p-6 m-4 flex flex-col items-center border border-blue-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-700 text-center">{description}</p>
          <p>{groupCode}</p>
        </>
      )}
    </div>
  );
}

export default GroupInfoCard;
