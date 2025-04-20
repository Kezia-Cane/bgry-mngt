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
            <strong>Address:</strong>
            {resident?.address
              ? `${resident.address.street ? resident.address.street + ', ' : ''}${resident.address.barangay ? resident.address.barangay + ', ' : ''}${resident.address.city ? resident.address.city + ', ' : ''}${resident.address.province || ''}`
              : 'N/A'}
          </p>
          <p>
            <strong>Contact Number:</strong> {resident?.contactNumber || 'N/A'}
          </p>
          {resident?.birthdate && (
             <p><strong>Birthdate:</strong> {new Date(resident.birthdate).toLocaleDateString()}</p>
          )}
           {resident?.civilStatus && (
             <p><strong>Civil Status:</strong> {resident.civilStatus}</p>
          )}
           {resident?.occupation && (
             <p><strong>Occupation:</strong> {resident.occupation}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentViewModal;
