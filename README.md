# RealEstateX – Property Management System

RealEstateX is a full-stack property management system built to handle property listings, user authentication, and role-based access control. The application allows agents to create and manage property listings, customers to search for properties, and admins to oversee overall system activity. The project focuses on a secure, scalable architecture using modern web development practices.

## Features
- JWT-based authentication and authorization
- Role management: Admin, Agent, Customer
- Add, update, and delete property listings
- Upload and display property images
- Property search with filters (location, price, type)
- User and agent dashboards
- Cloud database integration using MongoDB Atlas
- Responsive frontend design

## Tech Stack

**Frontend**
- React or Angular  
- HTML, CSS, JavaScript

**Backend**
- Node.js + Express or Spring Boot  
- JWT Authentication  
- REST API structure

**Database**
- MongoDB Atlas

## Project Structure
/backend
/├── controllers
/├── models
/├── routes
/├── middleware
/└── config

/frontend
/├── src/components
/├── src/pages
/├── src/services
/└── public


## Getting Started

### 1. Clone the repository

git clone https://github.com/AtharvaShinde911/RealEstateX.git
cd RealEstateX

### 2. Install dependencies

## Frontend

cd frontend
npm install


## Backend

cd backend
npm install

### 3. Environment Variables

Create a .env file in the backend folder:

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000

### 4. Run the project

Backend

npm start


Frontend

npm start


** Future Improvements **

Map integration for property locations

Real-time chat between agents and customers

Payment gateway for booking properties

Advanced analytics dashboard for admins

License

This project is open-source and available under the MIT License.

