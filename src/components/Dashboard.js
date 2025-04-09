import React from "react";
import "./Dashboard.css";
// Import necessary icons from react-icons
import {
  FaAddressBook,
  FaEdit,
  FaEye,
  FaFileAlt,
  FaInfoCircle,
  FaPrint,
  FaSearch,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTrash,
  FaUserCog,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
// Assuming you have a logo image in your public folder or src/assets
// import logo from '/logo192.png'; // Example path if logo is in public folder

// Accept onLogout prop
function Dashboard({ onLogout }) {
  // In a real app, user info and permissions would determine which modules are shown
  // const { user } = useAuth(); // Example of getting user context
  // Placeholder for active module state
  const [activeModule, setActiveModule] = React.useState("Dashboard"); // Default to Dashboard

  // Placeholder data for the table
  const officials = [
    {
      id: 1,
      fullName: "Juan Dela Cruz",
      gender: "Male",
      age: 45,
      position: "Captain",
      term: "2023-2025",
      status: "Active",
    },
    {
      id: 2,
      fullName: "Maria Clara",
      gender: "Female",
      age: 38,
      position: "Kagawad",
      term: "2023-2025",
      status: "Active",
    },
    // Add more placeholder officials as needed
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Replace with actual logo */}
          <img
            src="/logo192.png"
            alt="Barangay Logo"
            className="sidebar-logo"
          />
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-title">Tools</span>
          <ul>
            {/* Render icons */}
            <li
              className={activeModule === "Dashboard" ? "active" : ""}
              onClick={() => setActiveModule("Dashboard")}
            >
              <FaTachometerAlt /> <span>Dashboard</span>
            </li>
            <li
              className={activeModule === "Brgy Official" ? "active" : ""}
              onClick={() => setActiveModule("Brgy Official")}
            >
              <FaUserTie /> <span>Brgy Official</span>
            </li>
            <li
              className={activeModule === "Resident" ? "active" : ""}
              onClick={() => setActiveModule("Resident")}
            >
              <FaUsers /> <span>Resident</span>
            </li>
            <li
              className={activeModule === "Blotter" ? "active" : ""}
              onClick={() => setActiveModule("Blotter")}
            >
              <FaAddressBook /> <span>Blotter</span>
            </li>
            <li
              className={activeModule === "Certificate" ? "active" : ""}
              onClick={() => setActiveModule("Certificate")}
            >
              <FaFileAlt /> <span>Certificate</span>
            </li>
            <li
              className={activeModule === "About" ? "active" : ""}
              onClick={() => setActiveModule("About")}
            >
              <FaInfoCircle /> <span>About</span>
            </li>
            <li
              className={activeModule === "Admin" ? "active" : ""}
              onClick={() => setActiveModule("Admin")}
            >
              <FaUserCog /> <span>Admin</span>
            </li>
            {/* Attach onLogout to onClick */}
            <li onClick={onLogout}>
              <FaSignOutAlt /> <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="main-header">
          {/* Top header content if any - image shows it empty */}
        </header>
        <main className="content-area">
          {/* Content changes based on activeModule */}
          {activeModule === "Brgy Official" && (
            <div>
              <div className="content-title-bar">
                <h2>Brgy Official</h2>
                {/* Button removed from here */}
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="last name">
                    <option value="last name">Last name</option>
                    <option value="first name">First name</option>
                    <option value="position">Position</option>
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Full name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Position</th>
                      <th>Term</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officials.map((official) => (
                      <tr key={official.id}>
                        <td>{official.fullName}</td>
                        <td>{official.gender}</td>
                        <td>{official.age}</td>
                        <td>{official.position}</td>
                        <td>{official.term}</td>
                        <td>{official.status}</td>
                        <td className="action-buttons">
                          <button title="View">
                            <FaEye />
                          </button>
                          <button title="Edit">
                            <FaEdit />
                          </button>
                          {/* Using FaTrash for delete as per image */}
                          <button title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                {/* Add Button moved here, class changed */}
                <button
                  className="add-record-button"
                  style={{ marginRight: "10px" }}
                >
                  Add Official
                </button>
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}
          {/* Add conditional rendering for other modules here */}
          {/* Exclude Dashboard, Resident, Blotter, Certificate, and About from this generic fallback */}
          {activeModule !== "Brgy Official" &&
            activeModule !== "Dashboard" &&
            activeModule !== "Resident" &&
            activeModule !== "Blotter" &&
            activeModule !== "Certificate" &&
            activeModule !== "About" &&
            activeModule !== "Admin" && ( // Exclude Admin as well
              <div>
                <h2>{activeModule}</h2>{" "}
                {/* Keep title for Admin or other future modules */}
                <p>Content for {activeModule} module goes here.</p>{" "}
                {/* Added placeholder text */}
              </div>
            )}
          {activeModule === "Dashboard" && (
            <div className="dashboard-overview">
              <h2>Dashboard Overview</h2> {/* Added title back */}
              <p className="welcome-message">Welcome back, [User Name]!</p>{" "}
              {/* Added Welcome Message */}
              {/* Keep existing Dashboard content */}
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>Total Residents</h3>
                  <p>150</p> {/* Placeholder */}
                </div>
                <div className="overview-card">
                  <h3>Active Officials</h3>
                  <p>12</p> {/* Placeholder */}
                </div>
                <div className="overview-card">
                  <h3>New Blotter Cases </h3>
                  <p>5</p> {/* Placeholder */}
                </div>
                <div className="overview-card">
                  <h3>Certificates Issued</h3>
                  <p>25</p> {/* Placeholder */}
                </div>
              </div>
              {/* Placeholder for Charts */}
              <div className="dashboard-section">
                <h3>Analytics</h3>
                <div className="chart-placeholder">
                  Chart: Resident Demographics (Placeholder)
                </div>
                {/* Add more chart placeholders if needed */}
              </div>
            </div>
          )}
          {/* Add specific rendering for Resident module */}
          {activeModule === "Resident" && (
            <div>
              <div className="content-title-bar">
                <h2>Resident</h2> {/* Title for the Resident section */}
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="last name">
                    <option value="last name">Last name</option>
                    <option value="first name">First name</option>
                    <option value="address">Address</option>{" "}
                    {/* Resident specific search */}
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Full name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Address</th>
                      <th>Contact Number</th> {/* Resident specific column */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder Resident Data */}
                    <tr>
                      <td>John Doe</td>
                      <td>Male</td>
                      <td>30</td>
                      <td>123 Main St, Barangay XYZ</td>
                      <td>0917-123-4567</td>
                      <td className="action-buttons">
                        <button title="View">
                          <FaEye />
                        </button>
                        <button title="Edit">
                          <FaEdit />
                        </button>
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>Female</td>
                      <td>25</td>
                      <td>456 Oak Ave, Barangay XYZ</td>
                      <td>0928-987-6543</td>
                      <td className="action-buttons">
                        <button title="View">
                          <FaEye />
                        </button>
                        <button title="Edit">
                          <FaEdit />
                        </button>
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    {/* Add more placeholder residents as needed */}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                {/* Add Resident Button */}
                <button
                  className="add-record-button"
                  style={{ marginRight: "10px" }}
                >
                  Add Resident
                </button>
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}
          {/* Add specific rendering for Blotter module */}
          {activeModule === "Blotter" && (
            <div>
              <div className="content-title-bar">
                <h2>Blotter Records</h2>
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="complainant">
                    <option value="complainant">Complainant</option>
                    <option value="respondent">Respondent</option>
                    <option value="status">Status</option>
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date Recorded</th>
                      <th>Complainant</th>
                      <th>Respondent</th>
                      <th>Narrative (Summary)</th>
                      <th>Status</th>
                      <th>Actions Taken</th>
                      <th>Recorded By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder Blotter Data */}
                    <tr>
                      <td>2025-04-08</td>
                      <td>Pedro Penduko</td>
                      <td>Juan Tamad</td>
                      <td>Verbal altercation regarding property line...</td>
                      <td>Amicably Settled</td>
                      <td>Mediation</td>
                      <td>Officer Reyes</td>
                      <td className="action-buttons">
                        <button title="View">
                          <FaEye />
                        </button>
                        <button title="Edit">
                          <FaEdit />
                        </button>
                        {/* No delete for blotter usually, maybe archive? */}
                      </td>
                    </tr>
                    <tr>
                      <td>2025-04-07</td>
                      <td>Maria Makiling</td>
                      <td>Unknown</td>
                      <td>Reported theft of livestock...</td>
                      <td>Under Investigation</td>
                      <td>Initial report taken</td>
                      <td>Officer Santos</td>
                      <td className="action-buttons">
                        <button title="View">
                          <FaEye />
                        </button>
                        <button title="Edit">
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                    {/* Add more placeholder blotter records as needed */}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                {/* Add Record Button */}
                <button
                  className="add-record-button"
                  style={{ marginRight: "10px" }}
                >
                  Add New Record
                </button>
                {/* Print Button Added */}
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}
          {/* Add specific rendering for Certificate module */}
          {activeModule === "Certificate" && (
            <div>
              <div className="content-title-bar">
                <h2>Certificates</h2>
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="resident">
                    <option value="resident">Resident Name</option>
                    <option value="type">Certificate Type</option>
                    <option value="date">Date Issued</option>
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Certificate Type</th>
                      <th>Resident Name</th>
                      <th>Date Issued</th>
                      <th>Issued By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder Certificate Data */}
                    <tr>
                      <td>Barangay Indigency</td>
                      <td>John Doe</td>
                      <td>2025-04-01</td>
                      <td>Secretary Lee</td>
                      <td className="action-buttons">
                        <button title="View/Download">
                          <FaEye />
                        </button>
                        {/* Maybe Revoke? */}
                      </td>
                    </tr>
                    <tr>
                      <td>Barangay Residency</td>
                      <td>Jane Smith</td>
                      <td>2025-03-25</td>
                      <td>Secretary Lee</td>
                      <td className="action-buttons">
                        <button title="View/Download">
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                    {/* Add more placeholder certificate records as needed */}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                <button className="issue-certificate-button">
                  Issue New Certificate
                </button>
              </div>
            </div>
          )}
          {/* Add specific rendering for About module */}
          {activeModule === "About" && (
            <div className="about-section">
              <h2>About the Barangay Management System</h2>
              <p>
                The Barangay Management System aims to modernize the
                record-keeping and administrative processes within a barangay.
                It provides a centralized platform for managing resident
                information, barangay officials, blotter incidents, certificate
                issuance, and user accounts.
              </p>
              <p>
                This system intends to improve efficiency, transparency, and
                communication within the community.
              </p>
              {/* Add more details if needed, e.g., version, contact */}
              <p>Version: 1.0.0 (Placeholder)</p>
            </div>
          )}
          {/* Add specific rendering for Admin module */}
          {activeModule === "Admin" && (
            <div className="admin-section">
              <h2>Admin Panel</h2>

              {/* User Management Section */}
              <div className="dashboard-section">
                <h3>User Management</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Placeholder User Data */}
                      <tr>
                        <td>admin_user</td>
                        <td>Admin</td>
                        <td>Active</td>
                        <td className="action-buttons">
                          <button title="Edit">
                            <FaEdit />
                          </button>
                          <button title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>staff_user1</td>
                        <td>Staff</td>
                        <td>Active</td>
                        <td className="action-buttons">
                          <button title="Edit">
                            <FaEdit />
                          </button>
                          <button title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>staff_user2</td>
                        <td>Staff</td>
                        <td>Inactive</td>
                        <td className="action-buttons">
                          <button title="Edit">
                            <FaEdit />
                          </button>
                          <button title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="content-footer">
                  <button className="add-user-button">Add New User</button>
                </div>
              </div>

              {/* System Settings Section (Placeholder) */}
              <div className="dashboard-section">
                <h3>System Settings</h3>
                <p>Placeholder for system configuration options...</p>
                {/* Example Setting */}
                <div className="setting-item">
                  <label htmlFor="setting1">System Maintenance Mode:</label>
                  <select id="setting1">
                    <option value="off">Off</option>
                    <option value="on">On</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
