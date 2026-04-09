import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminService } from '../../services/index.js';
import { LoadingCenter, PageHeader } from '../../components/shared/index.jsx';
import { fmtCurrency, MONTH_NAMES } from '../../utils/formatDate.js';

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

const ChartTooltip = ({ active, payload, label }) => active && payload?.length ? (
    <div className="card" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
        <p className="text-muted">{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: 700 }}>{typeof p.value === 'number' ? fmtCurrency(p.value) : p.value}</p>)}
    </div>
) : null;

export default function AdminAnalytics() {
    const { data: rev, isLoading: lr } = useQuery({ queryKey: ['admin', 'revenue'], queryFn: () => adminService.getRevenueAnalytics().then(r => r.data.data) });
    const { data: mem, isLoading: lm } = useQuery({ queryKey: ['admin', 'memberGrowth'], queryFn: () => adminService.getMemberAnalytics().then(r => r.data.data) });
    const { data: att, isLoading: la } = useQuery({ queryKey: ['admin', 'attendanceA'], queryFn: () => adminService.getAttendanceAnalytics().then(r => r.data.data) });

    const revenueChart = (rev || []).map(d => ({ name: `${MONTH_NAMES[d._id.month - 1]}'${String(d._id.year).slice(2)}`, revenue: d.revenue }));
    const memberChart = (mem || []).map(d => ({ name: `${MONTH_NAMES[d._id.month - 1]}'${String(d._id.year).slice(2)}`, members: d.count }));
    const attChart = (att || []).slice(-30).map(d => ({ name: `${d._id.day}/${d._id.month}`, count: d.count }));

    return (
        <div>
            <PageHeader title="Analytics" subtitle="Data-driven insights about your gym" />

            <div className="grid-2 mb-6">
                <div className="chart-card">
                    <div className="chart-card__title">Monthly Revenue</div>
                    {lr ? <LoadingCenter /> : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={revenueChart}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} /></BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="chart-card">
                    <div className="chart-card__title">New Members / Month</div>
                    {lm ? <LoadingCenter /> : (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={memberChart}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Line type="monotone" dataKey="members" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} /></LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="chart-card">
                <div className="chart-card__title">Daily Attendance (Last 30 Days)</div>
                {la ? <LoadingCenter /> : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={attChart}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="count" fill="var(--warning)" radius={[4, 4, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
