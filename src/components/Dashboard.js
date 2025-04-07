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
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}
          {/* Add conditional rendering for other modules here */}
          {/* Exclude Dashboard and Resident from this generic fallback */}
          {activeModule !== "Brgy Official" &&
            activeModule !== "Dashboard" &&
            activeModule !== "Resident" && (
              <div>
                <h2>{activeModule}</h2>
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
              {/* Placeholder for Recent Activity / Announcements */}
              <div className="dashboard-section">
                <h3>Recent Activity / Announcements</h3>
                <ul className="activity-list">
                  <li>New blotter case filed: Case #123</li>
                  <li>Certificate of Indigency issued to John Doe.</li>
                  <li>Upcoming Barangay Assembly on [Date].</li>
                  <li>Resident Jane Smith updated contact information.</li>
                </ul>
              </div>
              {/* Enhanced Quick Links */}
              <div className="dashboard-section">
                <h3>Quick Links</h3>
                <div className="quick-links">
                  <a
                    href="#officials"
                    onClick={() => setActiveModule("Brgy Official")}
                  >
                    Manage Officials
                  </a>
                  <a
                    href="#residents"
                    onClick={() => setActiveModule("Resident")}
                  >
                    Manage Residents
                  </a>
                  <a href="#blotter" onClick={() => setActiveModule("Blotter")}>
                    View Blotter
                  </a>
                  <a
                    href="#certificates"
                    onClick={() => setActiveModule("Certificate")}
                  >
                    Issue Certificate
                  </a>
                </div>
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
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
