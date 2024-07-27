import { useState } from "react";
import { useLocation } from "react-router-dom";
import CreateGroupModal from "../components/CreateGroupModal";
import JoinGroupModal from "../components/JoinGroupModal";
import GroupInfoCard from "../components/GroupInfoCard"; // Import the updated component

export const UserInfo = () => {
  const location = useLocation();
  console.log("UserInfo page location: ", location);
  const { userInfo } = location.state || { userInfo: {} };
  const groupsList = userInfo?.groupsList || [];
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  console.log("UserInfo page userInfo: ", userInfo);
  const token = localStorage.getItem("authToken");

  return (
    <div>
      <h1 className="pt-4 pb-4 flex justify-center items-center font-bold text-4xl text-center">
        Welcome to ExpenseBuddy {userInfo.firstName || ""}{" "}
        {userInfo.lastName || ""}
      </h1>

      <div className="grid grid-cols-1 flex justify-center items-center md:grid-cols-3">
        {groupsList.length > 0 ? (
          groupsList.map((group) => (
            <GroupInfoCard
              key={group.groupId}
              title={group.name}
              description={group.description}
              groupCode={group.groupCode}
              auth={token}
            />
          ))
        ) : (
          <p>No groups found</p>
        )}
      </div>
      <div className="pt-5 flex justify-center items-center gap-6">
        <Button onClick={() => openModal("create")} text="Create Group" />
        <Button onClick={() => openModal("join")} text="Join a Group" />
        {showModal && (
          <>
            {modalType === "create" && (
              <CreateGroupModal
                auth={token}
                onClose={() => setShowModal(false)}
              />
            )}
            {modalType === "join" && (
              <JoinGroupModal
                auth={token}
                onClose={() => setShowModal(false)}
              />
            )}
          </>
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

export default UserInfo;
