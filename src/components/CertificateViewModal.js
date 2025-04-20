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
        // --- Safely access potentially nested/populated data ---
        const residentName = certificate?.resident?.fullName
                             || certificate?.residentName // Fallback if resident object not populated but name is passed directly
                             || '[Resident Name Not Found]';
        const issuerName = certificate?.issuedBy?.username
                           || certificate?.issuedBy // Fallback if issuedBy is just a string/ID
                           || '[Issuer Name Not Found]';
        const issueDateFormatted = certificate?.issueDate
                                   ? new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                   : '[Date Not Found]';
        const certificateType = certificate?.certificateType || '[Certificate Type Not Found]';
        const purpose = certificate?.purpose || '[Purpose Not Specified]'; // Added purpose

        return (
          <div id="certificate-layout" className="certificate-layout">
            {/* Header */}
            <div className="certificate-header">
              <img src="/logo.png" alt="Barangay Logo" className="certificate-logo" />
              <div>
                <p>Republic of the Philippines</p>
                <p>Province of Davao del Norte</p>
                <p>Municipality/City of Panabo City</p>
                <p><strong>BARANGAY NEW VISAYAS</strong></p>
                <p><em>Office of the Punong Barangay</em></p>
              </div>
              {/* Optional: Add another logo or seal */}
            </div>

            {/* Title */}
            <h2 className="certificate-title">{certificateType}</h2>

            {/* Body */}
            <div className="certificate-body">
              <p><strong>TO WHOM IT MAY CONCERN:</strong></p>
              <p>
                This is to certify that <strong>{residentName}</strong>, of legal age, Filipino,
                is a bonafide resident of Barangay New Visayas, Panabo City, Davao del Norte.
              </p>
              {/* Add specific content based on certificate type */}
              {certificateType === 'Barangay Indigency' && (
                <p>
                  This certification is issued upon the request of the above-named person for the purpose of
                  <strong> {purpose}</strong>.
                  Based on records available in this office, the subject person belongs to an indigent family.
                </p>
              )}
              {certificateType === 'Barangay Residency' && (
                <p>
                  This certification is issued upon the request of the above-named person for the purpose of
                  <strong> {purpose}</strong>.
                </p>
              )}
               {certificateType === 'Barangay Clearance' && (
                <p>
                  This certifies further that the subject person has no pending case filed before this office.
                  This clearance is issued upon the request of the subject person for the purpose of <strong> {purpose}</strong>.
                </p>
              )}
              {/* Add more conditions for other certificate types */}

              <p>
                Issued this <strong>{issueDateFormatted}</strong> at the Office of the Punong Barangay,
                Barangay Barangay New Visayas, Panabo City, Davao del Norte.
              </p>
            </div>

            {/* Signature */}
            <div className="certificate-signature">
              {/* Issuer Section */}
              <div className="signature-block issuer-block">
                <p className="signature-label">Issued by:</p>
                <p className="signature-name"><strong>{issuerName}</strong></p>
                <p className="signature-position"><em>Barangay Staff</em></p>
              </div>
              {/* Attestor Section */}
              <div className="signature-block attestor-block">
                  <p className="signature-label">Attested by:</p>
                  {/* Hardcoded Captain for now - could fetch dynamically later */}
                  <p className="signature-name"><strong>BRGY. CAPTAIN JOHN DOE</strong></p>
                  <p className="signature-position"><em>Punong Barangay</em></p>
              </div>
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
