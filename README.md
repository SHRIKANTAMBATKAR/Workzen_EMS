# WorkZen EMS - IT Training Management System

WorkZen EMS is a premium, glassmorphic-themed web application designed to streamline the operations of IT training institutes. It provides a robust platform for managing students, batches, attendance, and performance analytics across multiple organizational roles.

## 🚀 Key Features

### 👤 Multi-Role Architecture
- **Admin**: Full control over user management (Trainers, Analysts, Counselors) and system-wide overview.
- **Analyst**: Management of batches, student assignments, and data-driven reporting.
- **Counselor**: Lead management and student registration workflows.
- **Trainer**: Daily session logging, attendance tracking, and student progress oversight.

### 🎨 Modern UI/UX
- **Glassmorphic Design**: Sleek, transparent UI components with premium aesthetics.
- **Responsive Layout**: Optimized for both desktop and mobile views.
- **Live Theme**: Dark-themed console with vibrant accent colors and smooth transitions.

### 📊 Data & Analytics
- **Visual Insights**: Real-time charts and statistics using Recharts.
- **Session Logs**: Automated tracking of training hours and topics covered.
- **Attendance Tracking**: Simplified digital attendance marking system.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend (Mock)**: [JSON Server](https://github.com/typicode/json-server)
- **Icons**: [Lucide React](https://lucide.dev/) & [Heroicons](https://heroicons.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Utils**: Axios, React Router, React Hot Toast

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
To start both the frontend and the mock backend server simultaneously:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` and the API at `http://localhost:3001`.

## 📂 Project Structure
- `/src/pages`: Role-specific dashboards and management screens.
- `/src/components`: Reusable UI components and layouts.
- `/db.json`: Local database for JSON Server.
