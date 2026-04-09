import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_HOME = { admin: '/admin', trainer: '/trainer', member: '/member' };

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
    }
    return children;
};

export const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
    return children;
};

export { ROLE_HOME };
