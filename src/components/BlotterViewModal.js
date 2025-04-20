import React from "react";
import "./BlotterViewModal.css"; // We'll create this CSS file next

    const BlotterViewModal = ({ blotter, onClose }) => {
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
            <h2>Blotter Record Details</h2>
            <div className="modal-details">
              <p>
                <strong>Incident Date:</strong> {blotter?.incidentDate ? new Date(blotter.incidentDate).toLocaleDateString() : 'N/A'}
              </p>
              <p>
                <strong>Incident Type:</strong> {blotter?.incidentType || 'N/A'}
              </p>
              <p>
                <strong>Location:</strong> {blotter?.incidentLocation || 'N/A'}
              </p>
              <p>
                <strong>Complainant:</strong> {blotter?.complainant?.name || 'N/A'}
              </p>
              <p>
                <strong>Respondent:</strong> {blotter?.respondent?.name || 'N/A'}
              </p>
              <p>
                <strong>Narrative:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{blotter?.narrative || 'N/A'}</span>
              </p>
              <p>
                <strong>Status:</strong> {blotter?.status || 'N/A'}
              </p>
              <p>
                <strong>Actions Taken:</strong> {Array.isArray(blotter?.actionsTaken) ? `${blotter.actionsTaken.length} action(s) recorded` : (blotter?.actionsTaken || 'None')}
              </p>
              <p>
                <strong>Recorded By:</strong> {blotter?.recordedBy?.username || 'N/A'}
              </p>
              <p>
                <strong>Date Recorded:</strong> {blotter?.createdAt ? new Date(blotter.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      );
    };

    export default BlotterViewModal;
