import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/index.js';
import { LoadingCenter, PageHeader, Badge, EmptyState } from '../../components/shared/index.jsx';
import { fmtDate, fmtCurrency, getInitials, daysUntil } from '../../utils/formatDate.js';

export default function AdminSubscriptions() {
    const { data, isLoading } = useQuery({ queryKey: ['admin', 'subscriptions'], queryFn: () => adminService.getSubscriptions({ limit: 100 }).then(r => r.data.data) });

    return (
        <div>
            <PageHeader title="Subscriptions" subtitle={`${data?.total ?? 0} total subscriptions`} />
            <div className="card">
                {isLoading ? <LoadingCenter /> : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Start</th><th>Expires</th><th>Days Left</th></tr></thead>
                            <tbody>
                                {!(data?.subscriptions?.length) && <tr><td colSpan={6}><EmptyState title="No subscriptions" /></td></tr>}
                                {(data?.subscriptions || []).map(s => {
                                    const left = daysUntil(s.endDate);
                                    return (
                                        <tr key={s._id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="sidebar__avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{getInitials(s.memberId?.name)}</div>
                                                    <div><div className="font-medium">{s.memberId?.name}</div><div className="text-xs text-muted">{s.memberId?.email}</div></div>
                                                </div>
                                            </td>
                                            <td><span className="font-medium">{s.membershipId?.name || '—'}</span><br /><span className="text-xs text-muted">{s.membershipId?.price ? fmtCurrency(s.membershipId.price) : ''}</span></td>
                                            <td><Badge status={s.status} /></td>
                                            <td className="text-sm text-muted">{fmtDate(s.startDate)}</td>
                                            <td className="text-sm text-muted">{fmtDate(s.endDate)}</td>
                                            <td>
                                                {left !== null ? (
                                                    <span style={{ color: left < 7 ? 'var(--danger)' : left < 30 ? 'var(--warning)' : 'var(--accent)', fontWeight: 600, fontSize: '0.875rem' }}>
                                                        {left > 0 ? `${left}d` : 'Expired'}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
