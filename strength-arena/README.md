# Strength Arena – Gym Management System (P-0001)

A high-fidelity, full-stack gym management platform designed to digitalize and streamline operations for admins, trainers, and members.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB 7 (local or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and SMTP details
npm run seed  # Seed the database with demo users
npm run dev   # Start backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Start frontend on http://localhost:5173
```

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@strengtharena.com` | `Admin@123` |
| **Trainer** | `trainer@strengtharena.com` | `Trainer@123` |
| **Member** | `arjun@example.com` | `Member@123` |

## 🏗️ Project Structure

- **`backend/`**: Node.js & Express REST API
  - `controllers/`, `models/`, `routes/`, `middleware/`, `utils/`
- **`frontend/`**: React (Vite) Single Page Application
  - `components/`, `pages/`, `services/`, `context/`, `styles/`

## 💎 Features
- **Admin**: Member/Trainer management, subscription billing, dashboard analytics.
- **Trainer**: Assign workout/diet plans to members, manual attendance tagging.
- **Member**: Personal dashboard, attendance streak, progress tracking, access plans.
- **Security**: JWT Dual-Token (Access/Refresh), Role-based route guards, and encrypted passwords.
