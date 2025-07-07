import React from 'react';

interface ResetDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetDayModal: React.FC<ResetDayModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Reset Day</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to reset all meals for today?</p>
          <p>This will remove all food entries from all meals. The food database will not be affected.</p>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ backgroundColor: '#e74c3c', color: 'white' }}
          >
            Reset Day
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetDayModal; 