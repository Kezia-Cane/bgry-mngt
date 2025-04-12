import React from "react";
import "./OfficialViewModal.css";

    const OfficialViewModal = ({ official, onClose }) => {
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
        <h2>Brgy Official Details</h2>
        <div className="modal-details">
          <p>
            <strong>Full Name:</strong> {official?.fullName}
          </p>
          <p>
            <strong>Gender:</strong> {official?.gender}
          </p>
          <p>
            <strong>Age:</strong> {official?.age}
          </p>
          <p>
            <strong>Position:</strong> {official?.position}
          </p>
          <p>
            <strong>Term:</strong> {official?.term}
          </p>
          <p>
            <strong>Status:</strong> {official?.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficialViewModal;
