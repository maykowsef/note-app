import React from 'react';
import './dialoguePopUp.css';


const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="dialog-container">
      <div className="dialog-box">
        <h2 className="dialog-title">Are you sure you want to delete this?</h2>
            <div className='popup-actions-wrapper'>
          <button className="dialog-button cancel" onClick={onClose}>Cancel</button>
          <button className="dialog-button delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
