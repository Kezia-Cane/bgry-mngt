import React from 'react';
import './Dashboard.css';
// Import necessary icons from react-icons
import {
  FaAddressBook,
  FaEdit, FaEye,
  FaFileAlt, FaInfoCircle,
  FaPrint,
  FaSearch,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTrash,
  FaUserCog,
  FaUserTie, FaUsers
} from 'react-icons/fa';
// Assuming you have a logo image in your public folder or src/assets
// import logo from '/logo192.png'; // Example path if logo is in public folder

function Dashboard() {
  // In a real app, user info and permissions would determine which modules are shown
  // In a real app, user info and permissions would determine which modules are shown
  // const { user } = useAuth(); // Example of getting user context
  // Placeholder for active module state
  const [activeModule, setActiveModule] = React.useState('Brgy Official'); // Default to Brgy Official as per image

  // Placeholder data for the table
  const officials = [
    { id: 1, fullName: 'Juan Dela Cruz', gender: 'Male', age: 45, position: 'Captain', term: '2023-2025', status: 'Active' },
    { id: 2, fullName: 'Maria Clara', gender: 'Female', age: 38, position: 'Kagawad', term: '2023-2025', status: 'Active' },
    // Add more placeholder officials as needed
  ];


  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Replace with actual logo */}
          <img src="/logo192.png" alt="Barangay Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-title">Tools</span>
          <ul>
            {/* Render icons */}
            <li className={activeModule === 'Dashboard' ? 'active' : ''} onClick={() => setActiveModule('Dashboard')}>
              <FaTachometerAlt /> <span>Dashboard</span>
            </li>
            <li className={activeModule === 'Brgy Official' ? 'active' : ''} onClick={() => setActiveModule('Brgy Official')}>
              <FaUserTie /> <span>Brgy Official</span>
            </li>
            <li className={activeModule === 'Resident' ? 'active' : ''} onClick={() => setActiveModule('Resident')}>
              <FaUsers /> <span>Resident</span>
            </li>
            <li className={activeModule === 'Blotter' ? 'active' : ''} onClick={() => setActiveModule('Blotter')}>
              <FaAddressBook /> <span>Blotter</span>
            </li>
            <li className={activeModule === 'Certificate' ? 'active' : ''} onClick={() => setActiveModule('Certificate')}>
              <FaFileAlt /> <span>Certificate</span>
            </li>
            <li className={activeModule === 'About' ? 'active' : ''} onClick={() => setActiveModule('About')}>
              <FaInfoCircle /> <span>About</span>
            </li>
            <li className={activeModule === 'Admin' ? 'active' : ''} onClick={() => setActiveModule('Admin')}>
              <FaUserCog /> <span>Admin</span>
            </li>
            <li>
              <FaSignOutAlt /> <span>Logout</span> {/* Add onClick handler later */}
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
          {activeModule === 'Brgy Official' && (
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
                    <button className="search-button"><FaSearch /></button>
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
                    {officials.map(official => (
                      <tr key={official.id}>
                        <td>{official.fullName}</td>
                        <td>{official.gender}</td>
                        <td>{official.age}</td>
                        <td>{official.position}</td>
                        <td>{official.term}</td>
                        <td>{official.status}</td>
                        <td className="action-buttons">
                          <button title="View"><FaEye /></button>
                          <button title="Edit"><FaEdit /></button>
                          {/* Using FaTrash for delete as per image */}
                          <button title="Delete"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                 <button className="print-button"><FaPrint /> Print</button>
              </div>
            </div>
          )}
           {/* Add conditional rendering for other modules here */}
           {activeModule !== 'Brgy Official' && (
             <div>
               <h2>{activeModule}</h2>
               <p>Content for {activeModule} module goes here.</p>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
