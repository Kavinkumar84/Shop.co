import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import '../css/DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, addressName, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="delete-modal-close" onClick={onClose} disabled={isDeleting}>
                    <FiX size={24} />
                </button>

                <div className="delete-modal-content">
                    <div className="delete-modal-icon">
                        <FiAlertTriangle size={48} />
                    </div>

                    <h2>Delete Address?</h2>

                    <p>
                        Are you sure you want to delete <strong>{addressName}</strong> address?
                        This action cannot be undone.
                    </p>

                    <div className="delete-modal-actions">
                        <button
                            className="delete-btn-cancel"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className="delete-btn-confirm"
                            onClick={onConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Address'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
