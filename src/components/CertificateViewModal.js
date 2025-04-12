import React from 'react';
import { FaPrint, FaTimes } from 'react-icons/fa';
import './CertificateViewModal.css'; // We'll create this CSS file next

    function CertificateViewModal({ certificate, onClose }) {
      if (!certificate) return null;

      // Function to handle overlay click
      const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      };

      // Function to handle printing
      const handlePrint = () => {
        // In a real app, you might use a library like react-to-print
        // or generate a PDF. For now, we'll use the browser's print function.
        const printableContent = document.getElementById('certificate-layout');
        if (printableContent) {
          const printWindow = window.open('', '_blank');
          printWindow.document.write('<html><head><title>Print Certificate</title>');
          // Optional: Link to external CSS for print styles
          // printWindow.document.write('<link rel="stylesheet" href="/path/to/print-styles.css" type="text/css" />');
          printWindow.document.write('<style>');
          // Add basic print styles - hide buttons, etc.
          printWindow.document.write(`
            @media print {
              body * { visibility: hidden; }
              #certificate-layout, #certificate-layout * { visibility: visible; }
              #certificate-layout { position: absolute; left: 0; top: 0; width: 100%; }
              .modal-actions-print { display: none; } /* Hide buttons in print */
            }
          `);
          printWindow.document.write('</style></head><body>');
          printWindow.document.write(printableContent.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus(); // Necessary for some browsers
          printWindow.print();
          // printWindow.close(); // Close automatically after print dialog (optional)
        } else {
          console.error("Could not find printable content");
          alert("Error preparing certificate for printing.");
        }
      };


      // Basic layout - This should be customized based on actual certificate formats
      const renderCertificateLayout = () => {
        return (
          <div id="certificate-layout" className="certificate-layout">
            {/* Header */}
            <div className="certificate-header">
              <img src="/logo192.png" alt="Barangay Logo" className="certificate-logo" />
              <div>
                <p>Republic of the Philippines</p>
                <p>Province of [Province Name]</p>
                <p>Municipality/City of [Municipality/City Name]</p>
                <p><strong>BARANGAY [Barangay Name]</strong></p>
                <p><em>Office of the Punong Barangay</em></p>
              </div>
              {/* Optional: Add another logo or seal */}
            </div>

            {/* Title */}
            <h2 className="certificate-title">{certificate.certificateType}</h2>

            {/* Body */}
            <div className="certificate-body">
              <p><strong>TO WHOM IT MAY CONCERN:</strong></p>
              <p>
                This is to certify that <strong>{certificate.residentName}</strong>, of legal age, Filipino,
                is a bonafide resident of Barangay [Barangay Name], [Municipality/City Name], [Province Name].
              </p>
              {/* Add specific content based on certificate type */}
              {certificate.certificateType === 'Barangay Indigency' && (
                <p>
                  This certification is issued upon the request of the above-named person for the purpose of
                  [State Purpose, e.g., applying for financial assistance, medical assistance, etc.].
                  Based on records available in this office, the subject person belongs to an indigent family.
                </p>
              )}
              {certificate.certificateType === 'Barangay Residency' && (
                <p>
                  This certification is issued upon the request of the above-named person for the purpose of
                  [State Purpose, e.g., employment requirements, school enrollment, etc.].
                </p>
              )}
               {certificate.certificateType === 'Barangay Clearance' && (
                <p>
                  This certifies further that the subject person has no pending case filed before this office.
                  This clearance is issued upon the request of the subject person for [State Purpose, e.g., local employment, ID application, etc.].
                </p>
              )}
              {/* Add more conditions for other certificate types */}

              <p>
                Issued this <strong>{new Date(certificate.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> at the Office of the Punong Barangay,
                Barangay [Barangay Name], [Municipality/City Name], [Province Name], Philippines.
              </p>
            </div>

            {/* Signature */}
            <div className="certificate-signature">
              <p>Issued by:</p>
              <br />
              <p><strong>{certificate.issuedBy}</strong></p>
              <p><em>[Position of Issuer, e.g., Barangay Secretary]</em></p>
              <br /><br />
              <p>Attested by:</p>
              <br />
              <p><strong>[Punong Barangay Name]</strong></p>
              <p><em>Punong Barangay</em></p>
            </div>

             {/* Footer (Optional) */}
             <div className="certificate-footer">
                <p><em>Note: Not valid without the official barangay seal.</em></p>
                {/* Add OR Number, Amount Paid if applicable */}
             </div>
          </div>
        );
      };

      return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content certificate-view-modal">
            <button className="close-button" onClick={onClose}><FaTimes /></button>
            {renderCertificateLayout()}
            <div className="modal-actions-print">
              <button onClick={handlePrint} className="print-button">
                <FaPrint /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      );
    }

    export default CertificateViewModal;
