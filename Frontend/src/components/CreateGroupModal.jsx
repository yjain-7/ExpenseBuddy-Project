import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function CreateGroupModal ({ auth, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !description){
      setError("Name and description are required");
      return;
    }
    setError(null)
    try{
      const response = await fetch('https://expensebuddy-backend-n7y9.onrender.com/api/groups/createGroup', {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });
      if(!response.ok){
        throw new Error("Group creating fail")
      }
      const data = await response.json();
      const userInfo = data.userInfo;
      console.log(userInfo)
      if (response.ok) {
        onClose();
      } else {
        // Handle error
        console.error('Failed to create group');
      }
      navigate("/userInfo", { state: { userInfo } });
    }catch(error){
      setError(error.message)
    }
    
  };

  return (
    <div 
      onClick={(e) => e.target === e.currentTarget && onClose()} 
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'
    >
      <div className='bg-logo rounded-xl p-6 flex flex-col gap-5 items-center mx-4 text-black'>
        <button onClick={onClose} className='place-self-end'><X size={30} /></button>
        <div className='flex flex-col gap-5'>
          <h1 className='text-3xl font-extrabold text-center'>Create a Group</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='Enter group name'
              required
              className='w-full px-4 py-3 border-grey-300 rounded-md'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder='Enter group description'
              required
              className='w-full px-4 py-3 border-grey-300 rounded-md mt-4'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button 
              type="submit" 
              className='mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-black text-white'
            >
              Create Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

