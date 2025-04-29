# Barangay Management System

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-v18.x-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green)](https://nodejs.org/en/docs/)
[![Express](https://img.shields.io/badge/Express-v4.x-orange)](https://expressjs.com/)

This was originally our college project, first developed as a VB.NET Desktop application. Now, I’m converting it into a web-based system using the MERN stack to further develop and improve my software development skills.

A web-based Barangay Management System for efficiently managing residents, officials, certificates, and blotter records. Built with React for the frontend and Node.js/Express for the backend, this project streamlines barangay administration with a modern, user-friendly interface.



- **Modern UI/UX:** Responsive design with Lottie-powered loading animations for a smooth user experience.
- **Centralized API Handling:** All API calls are managed through a centralized Axios instance for maintainability.
- **Success Alerts:** User actions are confirmed with interactive alerts using SweetAlert2.
- **Deployment:** The app is deployed on Render (frontend as static site, backend as Node.js service).

## Table of Contents

* [Project Overview](#project-overview)
* [Modules and Functionalities](#modules-and-functionalities)
* [Technology Stack](#technology-stack)

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
* **Logout:** Securely log users out of the system.

## Technology Stack

* **Frontend:**
    * [React](https://react.dev/) (JavaScript library for building user interfaces)
* **Backend:**
    * [Node.js](https://nodejs.org/en/docs/) (JavaScript runtime environment)
    * [Express.js](https://expressjs.com/) (web application framework for Node.js)
    * **Database:** (https://www.mongodb.com/) (MongoDB)
