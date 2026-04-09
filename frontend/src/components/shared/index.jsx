import { Dumbbell } from 'lucide-react';
export { fmtDate, fmtDateTime, getInitials } from '../../utils/formatDate.js';

export function StatCard({ icon: Icon, label, value, change, changeType = 'positive', iconBg = 'rgba(124,58,237,0.15)', iconColor = 'var(--primary)' }) {
    return (
        <div className="stat-card">
            <div className="stat-card__icon" style={{ background: iconBg }}>
                <Icon size={22} color={iconColor} />
            </div>
            <div className="stat-card__value">{value}</div>
            <div className="stat-card__label">{label}</div>
            {change && <div className={`stat-card__change ${changeType}`}>{change}</div>}
        </div>
    );
}

export function Spinner({ size = 'md' }) {
    return <div className={`spinner spinner-${size}`} />;
}

export function LoadingCenter() {
    return <div className="loading-center"><Spinner size="lg" /></div>;
}

export function EmptyState({ icon: Icon = Dumbbell, title = 'Nothing here yet', message = '' }) {
    return (
        <div className="empty-state">
            <Icon size={48} />
            <h3>{title}</h3>
            {message && <p>{message}</p>}
        </div>
    );
}

export function Badge({ status }) {
    const map = {
        active: 'badge-active', expired: 'badge-expired', pending: 'badge-pending',
        paused: 'badge-paused', paid: 'badge-active', failed: 'badge-expired',
        cancelled: 'badge-expired', gold: 'badge-gold', platinum: 'badge-platinum',
        silver: 'badge-silver', basic: 'badge-basic',
    };
    return <span className={`badge ${map[status] || 'badge-basic'}`}>{status}</span>;
}

export function PageHeader({ title, subtitle, children }) {
    return (
        <div className="page-header flex items-center justify-between">
            <div>
                <h1>{title}</h1>
                {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}
