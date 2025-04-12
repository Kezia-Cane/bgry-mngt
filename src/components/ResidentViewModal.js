import React from "react";
import "./ResidentViewModal.css";

    const ResidentViewModal = ({ resident, onClose }) => {
      // Function to handle overlay click
      const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      };

      return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Resident Details</h2>
        <div className="modal-details">
          <p>
            <strong>Full Name:</strong> {resident?.fullName}
          </p>
          <p>
            <strong>Gender:</strong> {resident?.gender}
          </p>
          <p>
            <strong>Age:</strong> {resident?.age}
          </p>
          <p>
            <strong>Address:</strong> {resident?.address}
          </p>
          <p>
            <strong>Contact Number:</strong> {resident?.contactNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResidentViewModal;
