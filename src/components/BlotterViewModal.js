import React from "react";
import "./BlotterViewModal.css"; // We'll create this CSS file next

    const BlotterViewModal = ({ blotter, onClose }) => {
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={onClose}>
              &times;
            </button>
            <h2>Blotter Record Details</h2>
            <div className="modal-details">
              <p>
                <strong>Date Recorded:</strong> {blotter?.dateRecorded}
              </p>
              <p>
                <strong>Complainant:</strong> {blotter?.complainant}
              </p>
              <p>
                <strong>Respondent:</strong> {blotter?.respondent}
              </p>
              <p>
                <strong>Narrative:</strong> {blotter?.narrative}
              </p>
              <p>
                <strong>Status:</strong> {blotter?.status}
              </p>
              <p>
                <strong>Actions Taken:</strong> {blotter?.actionsTaken}
              </p>
              <p>
                <strong>Recorded By:</strong> {blotter?.recordedBy}
              </p>
            </div>
          </div>
        </div>
      );
    };

    export default BlotterViewModal;
