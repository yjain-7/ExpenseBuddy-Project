import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
const JoinGroupModal = ({ auth, onClose }) => {
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupCode) {
      setError("Group code requierd");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/groups/joinGroup",
        {
          method: "POST",
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupCode }),
        }
      );

      const data = await response.json();
      const userInfo = data.userInfo;
      console.log(userInfo);
      if (response.ok) {
        onClose();
      } else {
        // Handle error
        if(!response.ok){
          const errorData = await response.json();
          alert(errorData.error);
        }
        console.error("Failed to join group");
      }
      navigate("/userInfo", { state: { userInfo } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-logo rounded-xl p-6 flex flex-col gap-5 items-center mx-4 text-black">
        <button onClick={onClose} className="place-self-end">
          <X size={30} />
        </button>
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold text-center">Join Group</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter group code"
              required
              className="w-full px-4 py-3 border-grey-300 rounded-md"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-black text-white"
            >
              Join Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;
