# GatherUp

GatherUp is a comprehensive Event Management and Payment System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a seamless and visually stunning experience for users to browse events, manage their profiles, handle payment processing, and leave feedback, alongside a robust Admin dashboard.

## 🌟 Key Features

- **Event Management**: Browse, view details, and register for various events.
- **Payment Processing**: Integrated payment flows with secure card management in user profiles.
- **User Profiles**: Manage personal information, saved payment cards, and view payment history.
- **Feedback System**: Rate and review events/experiences, featuring Admin-level moderation and deletion capabilities via Role-Based Access Control (RBAC).
- **Premium UI/UX**: A highly polished, modern frontend design showcasing glassmorphism, subtle micro-animations, and modern typography, optimized with a sleek light-mode design.
- **Authentication**: Secure Login and Registration specifically tailored for normal Users and Admins.

## 🛠️ Technology Stack

**Frontend:**
- React (with Vite)
- Vanilla CSS (Custom design system with modern utilities)
- Context API for authentication and state management

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT) for secure authentication and RBAC
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your local machine
- A running MongoDB instance (or MongoDB Atlas cluster)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/sayumi2003/GatherUp.git
   cd GatherUp
   ```

2. Setup the Backend
   ```bash
   cd backend
   npm install
   # Create a .env file containing your config (e.g., PORT, MONGO_URI, and JWT_SECRET)
   npm start
   ```

3. Setup the Frontend
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📚 Project Structure

- `/backend`: Houses the server logic including Express API routes, customized controllers, Mongoose models, and authorization middleware.
- `/frontend`: Contains the React.js client application with reusable UI components and specialized user/admin dashboards.