'use client'
import Modal from 'react-modal';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemId }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Confirm Delete"
            className="bg-white p-6 rounded-2xl max-w-sm w-full mx-auto shadow-lg border border-gray-200 outline-none"
            overlayClassName="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
        >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Are you sure you want to delete this item?
            </h2>
            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out "
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        onConfirm(itemId); // pass the ID to the delete handler
                        onClose();
                    }}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}
