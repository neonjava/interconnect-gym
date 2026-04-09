import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, CreditCard, BarChart3, Bell, Settings, LogOut, User, Calendar, UtensilsCrossed, ClipboardList, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getInitials } from '../../utils/formatDate.js';

const ADMIN_NAV = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/members', icon: Users, label: 'Members' },
    { to: '/admin/trainers', icon: User, label: 'Trainers' },
    { to: '/admin/memberships', icon: CreditCard, label: 'Memberships' },
    { to: '/admin/subscriptions', icon: ClipboardList, label: 'Subscriptions' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

const TRAINER_NAV = [
    { to: '/trainer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/trainer/members', icon: Users, label: 'My Members' },
    { to: '/trainer/workout-plans', icon: Dumbbell, label: 'Workout Plans' },
    { to: '/trainer/diet-plans', icon: UtensilsCrossed, label: 'Diet Plans' },
    { to: '/trainer/attendance', icon: Calendar, label: 'Attendance' },
];

const MEMBER_NAV = [
    { to: '/member', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/member/my-plan', icon: Dumbbell, label: 'My Workout' },
    { to: '/member/diet', icon: UtensilsCrossed, label: 'Diet Plan' },
    { to: '/member/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/member/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/member/payments', icon: CreditCard, label: 'Payments' },
];

const NAV_MAP = { admin: ADMIN_NAV, trainer: TRAINER_NAV, member: MEMBER_NAV };

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const navItems = NAV_MAP[user?.role] || [];

    const handleLogout = async () => { await logout(); navigate('/login'); };

    return (
        <aside className="sidebar">
            <div className="sidebar__logo">
                <Dumbbell size={22} color="var(--primary)" />
                <span><span>Strength</span> Arena</span>
            </div>

            <nav className="sidebar__nav">
                <span className="sidebar__section-label">Navigation</span>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === `/${user?.role}`}
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
                <span className="sidebar__section-label" style={{ marginTop: '1rem' }}>Account</span>
                <button className="nav-item" style={{ border: 'none', width: '100%', textAlign: 'left', background: 'none' }} onClick={handleLogout}>
                    <LogOut size={18} />
                    Logout
                </button>
            </nav>

            <div className="sidebar__user">
                <div className="sidebar__avatar">{getInitials(user?.name)}</div>
                <div className="sidebar__user-info">
                    <div className="sidebar__user-name">{user?.name}</div>
                    <div className="sidebar__user-role">{user?.role}</div>
                </div>
            </div>
        </aside>
    );
}
