import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { adminService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState } from '../../components/shared/index.jsx';
import { fmtCurrency, fmtDate, getInitials } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

function PaymentModal({ members = [], onClose, onSave }) {
    const [form, setForm] = useState({ memberId: '', amount: '', method: 'cash', notes: '' });
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal__header"><h2>Record Payment</h2><button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>✕</button></div>
                <div className="modal__body flex-col gap-4">
                    <div className="form-group"><label className="form-label">Member</label>
                        <select className="form-input" value={form.memberId} onChange={set('memberId')}>
                            <option value="">Select member…</option>
                            {members.map(m => <option key={m._id} value={m._id}>{m.name} — {m.email}</option>)}
                        </select>
                    </div>
                    <div className="grid-2">
                        <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" min={0} value={form.amount} onChange={set('amount')} /></div>
                        <div className="form-group"><label className="form-label">Method</label>
                            <select className="form-input" value={form.method} onChange={set('method')}>
                                {['cash', 'upi', 'card', 'online', 'other'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group"><label className="form-label">Notes</label><input className="form-input" value={form.notes} onChange={set('notes')} placeholder="Optional" /></div>
                </div>
                <div className="modal__footer"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => onSave({ ...form, amount: Number(form.amount), status: 'paid' })}>Record</button></div>
            </div>
        </div>
    );
}

export default function AdminPayments() {
    const [showModal, setShowModal] = useState(false);
    const qc = useQueryClient();

    const { data, isLoading } = useQuery({ queryKey: ['admin', 'payments'], queryFn: () => adminService.getPayments({ limit: 100 }).then(r => r.data.data) });
    const { data: membersData } = useQuery({ queryKey: ['admin', 'members-all'], queryFn: () => adminService.getMembers({ limit: 200 }).then(r => r.data.data) });

    const createMutation = useMutation({
        mutationFn: adminService.createPayment,
        onSuccess: () => { qc.invalidateQueries(['admin', 'payments']); setShowModal(false); toast.success('Payment recorded!'); },
        onError: (e) => toast.error(e?.response?.data?.message || 'Failed.'),
    });

    const statusColor = { paid: 'var(--accent)', pending: 'var(--warning)', failed: 'var(--danger)', refunded: 'var(--info)' };

    return (
        <div>
            <PageHeader title="Payments" subtitle="Track all payment transactions">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Record Payment</button>
            </PageHeader>

            <div className="card">
                {isLoading ? <LoadingCenter /> : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead><tr><th>Member</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                            <tbody>
                                {!(data?.payments?.length) && <tr><td colSpan={5}><EmptyState title="No payments yet" /></td></tr>}
                                {(data?.payments || []).map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="sidebar__avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{getInitials(p.memberId?.name)}</div>
                                                <div><div className="font-medium">{p.memberId?.name || 'Unknown'}</div><div className="text-xs text-muted">{p.memberId?.email}</div></div>
                                            </div>
                                        </td>
                                        <td className="font-semibold">{fmtCurrency(p.amount)}</td>
                                        <td className="text-muted" style={{ textTransform: 'capitalize' }}>{p.method}</td>
                                        <td><span style={{ color: statusColor[p.status], fontWeight: 600, fontSize: '0.875rem' }}>{p.status}</span></td>
                                        <td className="text-sm text-muted">{fmtDate(p.paidAt || p.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && <PaymentModal members={membersData?.members || []} onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
        </div>
    );
}
