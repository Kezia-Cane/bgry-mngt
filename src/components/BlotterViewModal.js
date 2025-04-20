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
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Incident Date:</strong>
                <span style={{ color: '#495057' }}>{blotter?.incidentDate ? new Date(blotter.incidentDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Incident Type:</strong>
                <span style={{ color: '#495057' }}>{blotter?.incidentType || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Location:</strong>
                <span style={{ color: '#495057' }}>{blotter?.incidentLocation || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Complainant:</strong>
                <span style={{ color: '#495057' }}>{blotter?.complainant?.name || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Respondent:</strong>
                <span style={{ color: '#495057' }}>{blotter?.respondent?.name || 'N/A'}</span>
              </div>
              <div className="narrative-flex-row">
                  <strong style={{ fontSize: '16px' }}>Narrative:</strong>
                  <span style={{ whiteSpace: 'pre-wrap', fontSize: '16px' }}>{blotter?.narrative || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Status:</strong>
                <span style={{ color: '#495057' }}>{blotter?.status || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Actions Taken:</strong>
                <span style={{ color: '#495057' }}>{Array.isArray(blotter?.actionsTaken) ? `${blotter.actionsTaken.length} action(s) recorded` : (blotter?.actionsTaken || 'None')}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Recorded By:</strong>
                <span style={{ color: '#495057' }}>{blotter?.recordedBy?.username || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <strong style={{ width: '140px', flexShrink: 0, color: '#343a40' }}>Date Recorded:</strong>
                <span style={{ color: '#495057' }}>{blotter?.createdAt ? new Date(blotter.createdAt).toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default BlotterViewModal;
