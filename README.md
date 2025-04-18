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
    * **ORM/ODM:** (Mongoose for MongoDB)
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (for authentication)
    * [bcrypt](https://www.npmjs.com/package/bcrypt) (for password hashing)
    * [cors](https://www.npmjs.com/package/cors) (for enabling Cross-Origin Resource Sharing)


