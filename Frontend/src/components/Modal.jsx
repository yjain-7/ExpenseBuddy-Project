import { useRef } from 'react'
import { X, Download } from 'lucide-react'

export const Modal = ({ onClose, type }) => {
  const modalRef = useRef()

  const closeModal = (e) => {
    if (modalRef.current === e.target) onClose()
  }

  return (
    <div ref={modalRef} onClick={closeModal} className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
      <div className='bg-logo rounded-xl p-6 flex flex-col gap-5 items-center mx-4 text-black'>
        <button onClick={onClose} className='place-self-end'><X size={30} /></button>
        {type === 'create' ? (
          <div className='flex flex-col gap-5'>
            <h1 className='text-3xl font-extrabold text-center'>Create a Group</h1>
            <form>
              <input
                type="text"
                placeholder='Enter group name'
                required
                className='w-full px-4 py-3 border-grey-300 rounded-md'
              />
              <textarea
                placeholder='Enter group description'
                required
                className='w-full px-4 py-3 border-grey-300 rounded-md mt-4'
              />
              <button className='mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-black text-white'>Create Group</button>
            </form>
          </div>
        ) : (
          <div className='flex flex-col gap-5'>
            <h1 className='text-3xl font-extrabold text-center'>Join Group</h1>
            <form>
              <input
                type="text"
                placeholder='Enter group code'
                required
                className='w-full px-4 py-3 border-grey-300 rounded-md'
              />
              <button className='mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-black text-white'>Join Group</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
