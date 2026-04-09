import { useQuery } from '@tanstack/react-query';
import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/index.js';
import { StatCard, LoadingCenter, PageHeader } from '../../components/shared/index.jsx';
import { fmtCurrency } from '../../utils/formatDate.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MONTH_NAMES } from '../../utils/formatDate.js';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
        <div className="card" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>{label}</p>
            <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{fmtCurrency(payload[0].value)}</p>
        </div>
    );
    return null;
};

export default function AdminDashboard() {
    const { data: dash, isLoading: loadDash } = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => adminService.getDashboard().then(r => r.data.data) });
    const { data: revData, isLoading: loadRev } = useQuery({ queryKey: ['admin', 'revenue'], queryFn: () => adminService.getRevenueAnalytics().then(r => r.data.data) });

    const chartData = (revData || []).map(d => ({
        name: `${MONTH_NAMES[d._id.month - 1]} ${d._id.year}`,
        revenue: d.revenue,
    }));

    if (loadDash) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

            {/* KPI Cards */}
            <div className="grid-4 mb-6">
                <StatCard icon={Users} label="Total Members" value={dash?.totalMembers ?? 0} iconBg="rgba(124,58,237,0.12)" iconColor="var(--primary)" />
                <StatCard icon={Activity} label="Active Subscriptions" value={dash?.activeSubscriptions ?? 0} iconBg="rgba(16,185,129,0.12)" iconColor="var(--accent)" />
                <StatCard icon={CreditCard} label="Today's Revenue" value={fmtCurrency(dash?.todayRevenue ?? 0)} iconBg="rgba(245,158,11,0.12)" iconColor="var(--warning)" />
                <StatCard icon={TrendingUp} label="Monthly Revenue" value={fmtCurrency(dash?.monthlyRevenue ?? 0)} iconBg="rgba(59,130,246,0.12)" iconColor="var(--info)" />
            </div>

            {/* Revenue Chart */}
            <div className="chart-card">
                <div className="chart-card__title">Revenue Overview</div>
                {loadRev ? <LoadingCenter /> : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
                            <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
