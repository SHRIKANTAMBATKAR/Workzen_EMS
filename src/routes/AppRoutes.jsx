import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import TrainerManagement from "../pages/admin/TrainerManagement";
import AnalystManagement from "../pages/admin/AnalystManagement";
import CounselorManagement from "../pages/admin/CounselorManagement";
import AllUsersList from "../pages/admin/AllUsersList";
import AnalystDashboard from "../pages/analyst/AnalystDashboard";
import BatchManagement from "../pages/analyst/BatchManagement";
import CounselorDashboard from "../pages/counselor/CounselorDashboard";
import StudentManagement from "../pages/counselor/StudentManagement";
import TrainerDashboard from "../pages/trainer/TrainerDashboard";
import Attendance from "../pages/trainer/Attendance";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/trainers" element={<TrainerManagement />} />
        <Route path="/admin/analysts" element={<AnalystManagement />} />
        <Route path="/admin/counselors" element={<CounselorManagement />} />
        <Route path="/admin/all-users" element={<AllUsersList />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* Analyst */}
        <Route path="/analyst" element={<AnalystDashboard />} />
        <Route path="/analyst/batches" element={<BatchManagement />} />

        {/* Counselor */}
        <Route path="/counselor" element={<CounselorDashboard />} />
        <Route path="/counselor/students" element={<StudentManagement />} />

        {/* Trainer */}
        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/trainer/attendance/:batchId" element={<Attendance />} />
      </Routes>
    </BrowserRouter>
  );
}
