import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './utils/roleGuard.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Auth
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Landing from './pages/Landing.jsx';

// Admin
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminMembers from './pages/admin/Members.jsx';
import AdminTrainers from './pages/admin/Trainers.jsx';
import AdminMemberships from './pages/admin/Memberships.jsx';
import AdminPayments from './pages/admin/Payments.jsx';
import AdminAnalytics from './pages/admin/Analytics.jsx';
import AdminSubscriptions from './pages/admin/Subscriptions.jsx';

// Trainer
import TrainerDashboard from './pages/trainer/Dashboard.jsx';
import TrainerMembers from './pages/trainer/MyMembers.jsx';
import WorkoutPlans from './pages/trainer/WorkoutPlans.jsx';
import DietPlans from './pages/trainer/DietPlans.jsx';
import TrainerAttendance from './pages/trainer/Attendance.jsx';

// Member
import MemberDashboard from './pages/member/Dashboard.jsx';
import MemberMyPlan from './pages/member/MyPlan.jsx';
import MemberDiet from './pages/member/DietPlan.jsx';
import MemberAttendance from './pages/member/Attendance.jsx';
import MemberProgress from './pages/member/Progress.jsx';
import MemberPayments from './pages/member/Payments.jsx';

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="trainers" element={<AdminTrainers />} />
                <Route path="memberships" element={<AdminMemberships />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Trainer */}
            <Route path="/trainer" element={<ProtectedRoute allowedRoles={['trainer']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<TrainerDashboard />} />
                <Route path="members" element={<TrainerMembers />} />
                <Route path="workout-plans" element={<WorkoutPlans />} />
                <Route path="diet-plans" element={<DietPlans />} />
                <Route path="attendance" element={<TrainerAttendance />} />
            </Route>

            {/* Member */}
            <Route path="/member" element={<ProtectedRoute allowedRoles={['member']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<MemberDashboard />} />
                <Route path="my-plan" element={<MemberMyPlan />} />
                <Route path="diet" element={<MemberDiet />} />
                <Route path="attendance" element={<MemberAttendance />} />
                <Route path="progress" element={<MemberProgress />} />
                <Route path="payments" element={<MemberPayments />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
