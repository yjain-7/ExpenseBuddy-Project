import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "../components/Modal";
import GroupInfoCard from "../components/GroupInfoCard"; // Import the updated component

export const Group = () => {
  const location = useLocation();
  const { userInfo } = location.state || {};
  const groupList = userInfo?.groupList || [];
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div>
      <h1 className="pt-4 pb-4 flex justify-center items-center font-bold text-4xl text-center">
        Welcome to ExpenseBuddy {userInfo.firstName} {userInfo.lastName}
        
      </h1>

      <div className="grid grid-cols-1 flex justify-center items-center md:grid-cols-3">
        {groupList.map((group) => (
          <GroupInfoCard
            key={group.groupId}
            title={group.name}
            description={group.description}
            groupCode={group.groupCode}
            auth={userInfo.token}
          />
        ))}
      </div>
      <div className="pt-5 flex justify-center items-center gap-6">
        <Button onClick={() => openModal("create")} text="Create Group" />
        <Button onClick={() => openModal("join")} text="Join a Group" />
        {showModal && (
          <Modal onClose={() => setShowModal(false)} type={modalType} />
        )}
      </div>
    </div>
  );
};

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

export default Group;
