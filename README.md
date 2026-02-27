# Medical-Appointment-System
RESTful medical appointment system with Node.js/Express backend, React frontend and MongoDB database.

# Medical Appointment Management System

Full-stack web application for managing medical appointments with public booking system, administrative panel, JWT authentication and automated email notifications.

---

## Overview

This system allows patients to request medical appointments without prior registration, while administrative staff can securely manage appointments, users and insurance providers through a protected panel.

The application follows a client-server architecture using a RESTful API and implements role-based access control with secure authentication.

---

## Tech Stack

### Frontend
- React
- Material UI
- React Router
- Context API
- date-fns

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Nodemailer
- dotenv
- CORS

---

## Main Features

### Public Module
- Appointment booking without registration
- Real-time availability validation
- Automatic "pending" status assignment
- Responsive user interface

### Administrative Module
- Secure login using JWT authentication
- Role-based access control (Admin / Secretary)
- Appointment confirmation and cancellation
- Automatic email notifications for confirmation and cancellation
- Insurance provider management (CRUD)
- User management with role assignment (Admin only)
- Prevention of duplicate bookings
- Protection against deletion of main administrator

---

## Security Implementation

- JWT authentication with 24-hour expiration
- Role-based authorization middleware
- Password hashing using bcrypt (10 salt rounds)
- Protected API routes
- Environment variables for sensitive configuration
- Input validation in frontend and backend
- CORS configuration for controlled access

---

## Architecture

Client-Server Architecture

Frontend (React SPA)  
→ REST API (Express.js)  
→ MongoDB Atlas  

Design Pattern: Model-View-Controller (MVC)

- Model: Mongoose schemas (User, Cita, ObraSocial)
- View: React components
- Controller: Route handlers and business logic

---

## Email Notification System

- Gmail SMTP integration
- HTML email templates
- Automatic notifications on appointment confirmation and cancellation
- Error handling and logging for email operations

---

## Installation

### 1. Clone the repository

git clone https://github.com/your-username/medical-appointment-system.git

---

### 2. Backend Setup

cd backend  
npm install  

Create a .env file inside the backend directory with the following variables:

MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret_key  
EMAIL_USER=your_email  
EMAIL_PASS=your_app_password  

Initialize database:

node initDB.js  
node initObrasSociales.js  

Start backend server:

npm start  

Backend runs on:  
http://localhost:5000  

---

### 3. Frontend Setup

cd frontend  
npm install  
npm start  

Frontend runs on:  
http://localhost:3000  

---

## Test Credentials

Administrator  
Email: dr.gomez@clinica.com  
Password: admin123  

---

## API Endpoints

Authentication
- POST /api/auth/login
- GET /api/auth/verify

Appointments
- GET /api/citas
- POST /api/citas
- PUT /api/citas/:id/estado
- GET /api/citas/disponibilidad

Insurance Providers
- GET /api/obras-sociales
- POST /api/obras-sociales
- PUT /api/obras-sociales/:id
- DELETE /api/obras-sociales/:id

Users (Admin only)
- GET /api/users
- POST /api/users
- DELETE /api/users/:id

---

## Database Collections

users  
citas  
obrassociales  

Each collection includes automatic timestamps and validation rules.

---

## Author

Matías Germán Gómez  
Software Development Student – UADE
