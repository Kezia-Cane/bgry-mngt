# Barangay Management System

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-v18.x-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green)](https://nodejs.org/en/docs/)
[![Express](https://img.shields.io/badge/Express-v4.x-orange)](https://expressjs.com/)

A web application to streamline the management and administrative tasks of a barangay (village/district) in the Philippines. Built with React for the frontend and Node.js/Express for the backend.

## Table of Contents

* [Project Overview](#project-overview)
* [Modules and Functionalities](#modules-and-functionalities)
* [Technology Stack](#technology-stack)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Frontend Setup](#frontend-setup)
    * [Backend Setup](#backend-setup)
    * [Running the Application](#running-the-application)
* [Development Plan](#development-plan)
    * [Phase 1: Project Setup and Authentication](#phase-1-project-setup-and-authentication)
    * [Phase 2: Dashboard and Barangay Official Module](#phase-2-dashboard-and-barangay-official-module)
    * [Phase 3: Resident Module](#phase-3-resident-module)
    * [Phase 4: Blotter Module](#phase-4-blotter-module)
    * [Phase 5: Certificate Module](#phase-5-certificate-module)
    * [Phase 6: About and Admin Modules](#phase-6-about-and-admin-modules)
    * [Phase 7: Logout and Refinements](#phase-7-logout-and-refinements)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## Project Overview

The Barangay Management System aims to modernize the record-keeping and administrative processes within a barangay. It provides a centralized platform for managing resident information, barangay officials, blotter incidents, certificate issuance, and user accounts. This system intends to improve efficiency, transparency, and communication within the community.

## Modules and Functionalities

* **Login:** Secure user authentication with username/password and role-based access control (e.g., admin, staff).
* **Dashboard:** A central overview page with potential summary information or quick links to different modules.
* **Brgy Official:**
    * View a list of barangay officials with details (Full name, Gender, Age, Position, Term, Status).
    * Add, edit, and delete barangay official information.
    * Potentially manage profile pictures.
* **Resident:**
    * View, add, edit, and delete resident information (full name, address, birthdate, gender, contact number, etc.).
    * Search and filter residents.
* **Blotter:**
    * Record and manage barangay blotter incidents (date, complainant, respondent, narrative, status, actions taken, recorded by).
    * View, add, and update blotter records.
* **Certificate:**
    * Manage the issuance of various barangay certificates (e.g., residency, indigency).
    * Potentially create templates and generate certificates for specific residents.
    * Track issued certificates.
* **About:** A static page providing information about the system or the barangay.
* **Admin:** (Accessible to admin users)
    * Manage user accounts (add, edit, delete users and their roles).
    * Potentially configure system settings.
* **Logout:** Securely log users out of the system.

## Technology Stack

* **Frontend:**
    * [React](https://react.dev/) (JavaScript library for building user interfaces)
    * [React Router](https://reactrouter.com/) (for navigation)
    * [Axios](https://axios-http.com/docs/intro) (for making HTTP requests)
    * [State Management:** (To be decided - potentially Context API with `useReducer`, Redux, or Zustand)
    * **Styling:** (To be decided - CSS Modules, Styled Components, or a UI library like Material UI or Ant Design)
* **Backend:**
    * [Node.js](https://nodejs.org/en/docs/) (JavaScript runtime environment)
    * [Express.js](https://expressjs.com/) (web application framework for Node.js)
    * **Database:** (MongoDB)
    * **ORM/ODM:** (To be decided - Sequelize for PostgreSQL/MySQL, Mongoose for MongoDB)
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (for authentication)
    * [bcrypt](https://www.npmjs.com/package/bcrypt) (for password hashing)
    * [cors](https://www.npmjs.com/package/cors) (for enabling Cross-Origin Resource Sharing)

## Getting Started

This section outlines the steps to get the development environment up and running.

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
* A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))
* (Optional) A database management tool (e.g., pgAdmin for PostgreSQL, MySQL Workbench for MySQL, MongoDB Compass for MongoDB)

### Frontend Setup

1.  Navigate to the `frontend` directory in your project:
    ```bash
    cd frontend
    ```
2.  Install the frontend dependencies:
    ```bash
    npm install  # or yarn install
    ```
3.  Start the development server:
    ```bash
    npm start    # or yarn start
    ```
    This will usually start the React application on `http://localhost:3000`.

### Backend Setup

1.  Navigate to the `backend` directory in your project:
    ```bash
    cd ../backend
    ```
2.  Install the backend dependencies:
    ```bash
    npm install  # or yarn install
    ```
3.  Configure the database:
    * Create a `.env` file in the `backend` directory to store your database connection details and other sensitive information (e.g., JWT secret).
    * Example `.env` (adjust based on your chosen database):
        ```env
        DATABASE_URL=postgres://user:password@host:port/database
        JWT_SECRET=your-secret-key
        ```
    * (If using an ORM/ODM) Configure the connection in your backend code (e.g., in `config/database.js`).
4.  (Optional) Set up database migrations or seeders if using an ORM.
5.  Start the backend server:
    ```bash
    npm run dev  # or yarn dev (you might need to configure this script in package.json)
    ```
    This will typically start the Node.js/Express server on a port like `http://localhost:5000`.

### Running the Application

1.  Ensure both the frontend and backend development servers are running.
2.  Open your web browser and navigate to the frontend URL (usually `http://localhost:3000`).

## Development Plan

This is a tentative development plan outlining the phases for building the Barangay Management System.

### Phase 1: Project Setup and Authentication

* **Backend:**
    * Set up basic Node.js/Express server.
    * Configure database connection.
    * Define the `User` model (username, password, role).
    * Implement authentication controllers (register, login).
    * Create authentication routes (`/api/auth`).
    * Implement JWT-based authentication middleware.
* **Frontend:**
    * Set up basic React application with routing.
    * Create `LoginPage` component with login form.
    * Implement `AuthContext` for managing authentication state.
    * Implement API calls to backend login endpoint.
    * Implement protected routes.

### Phase 2: Dashboard and Barangay Official Module

* **Backend:**
    * Define the `BarangayOfficial` model.
    * Create `barangayOfficialController` with CRUD operations.
    * Create `barangayOfficialRoutes` (`/api/barangay-officials`), protected by auth middleware.
* **Frontend:**
    * Create `DashboardPage` with basic layout.
    * Create `BrgyOfficialPage` to display a list of officials in a table.
    * Implement API calls to fetch barangay officials.
    * Implement basic UI for adding, editing, and deleting officials (initially without full form functionality).

### Phase 3: Resident Module

* **Backend:**
    * Define the `Resident` model.
    * Create `residentController` with CRUD operations.
    * Create `residentRoutes` (`/api/residents`), protected by auth middleware.
* **Frontend:**
    * Create `ResidentPage` to display a list of residents in a table.
    * Implement API calls to fetch residents.
    * Implement basic UI for adding, editing, and deleting residents.

### Phase 4: Blotter Module

* **Backend:**
    * Define the `Blotter` model.
    * Create `blotterController` with CRUD operations.
    * Create `blotterRoutes` (`/api/blotters`), protected by auth middleware.
* **Frontend:**
    * Create `BlotterPage` to display a list of blotter incidents.
    * Implement UI for adding new blotter records and viewing details.

### Phase 5: Certificate Module

* **Backend:**
    * Define the `Certificate` model.
    * Create `certificateController` with functions for managing certificates.
    * Create `certificateRoutes` (`/api/certificates`), protected by auth middleware.
    * (Initial) Implement basic logic for issuing certificates.
* **Frontend:**
    * Create `CertificatePage` to view and manage certificates.
    * Implement UI for issuing new certificates (selecting resident and type).

### Phase 6: About and Admin Modules

* **Backend:**
    * Implement user management functionalities in `authController` or a new `userController` (for admin users).
    * Create `userRoutes` (`/api/users`), protected by admin role middleware.
* **Frontend:**
    * Create a simple `AboutPage`.
    * Create an `AdminPage` (accessible only to admins) to manage user accounts.

### Phase 7: Logout and Refinements

* **Frontend:**
    * Implement a "Logout" functionality.
    * Implement form validation for all input fields.
    * Improve UI/UX based on feedback.
    * Implement better error handling and user feedback.
* **Backend:**
    * Implement robust input validation.
    * Enhance security measures.

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes. Ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

[Your Name/Organization Name]
[Your Email Address]
[Link to your GitHub profile (optional)]
