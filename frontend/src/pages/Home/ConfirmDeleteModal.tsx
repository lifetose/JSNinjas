import Modal from "@/components/Modal";
import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <Modal open={open}>
      <h2 className='text-xl font-bold mb-4'>Confirm Deletion</h2>
      <p>Are you sure you want to delete this item?</p>
      <div className='flex justify-end mt-4 gap-2'>
        <button
          className='bg-gray-400 text-white px-4 py-2 rounded-md'
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
          onClick={onConfirm}
        >
          Yes, Delete
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
