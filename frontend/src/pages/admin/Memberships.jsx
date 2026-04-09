import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminService } from '../../services/index.js';
import { LoadingCenter, PageHeader, Badge, EmptyState } from '../../components/shared/index.jsx';
import { fmtCurrency } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

function PlanModal({ initialData, onClose, onSave }) {
    const [form, setForm] = useState(initialData || { name: '', durationMonths: 1, price: 999, badge: 'basic', features: '' });
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal__header"><h2>{initialData ? 'Edit Plan' : 'Create Plan'}</h2><button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>✕</button></div>
                <div className="modal__body flex-col gap-4">
                    <div className="form-group"><label className="form-label">Plan Name</label><input className="form-input" value={form.name} onChange={set('name')} /></div>
                    <div className="grid-2">
                        <div className="form-group"><label className="form-label">Duration (months)</label><input className="form-input" type="number" min={1} value={form.durationMonths} onChange={set('durationMonths')} /></div>
                        <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" min={0} value={form.price} onChange={set('price')} /></div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Badge</label>
                        <select className="form-input" value={form.badge} onChange={set('badge')}>
                            {['basic', 'silver', 'gold', 'platinum'].map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label className="form-label">Features (comma separated)</label><textarea className="form-input" rows={3} value={form.features} onChange={set('features')} placeholder="Gym access, Locker room, Diet plan…" /></div>
                </div>
                <div className="modal__footer">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => onSave({ ...form, price: Number(form.price), durationMonths: Number(form.durationMonths), features: typeof form.features === 'string' ? form.features.split(',').map(f => f.trim()).filter(Boolean) : form.features })}>Save Plan</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminMemberships() {
    const [modal, setModal] = useState(null);
    const qc = useQueryClient();

    const { data: plans, isLoading } = useQuery({ queryKey: ['admin', 'memberships'], queryFn: () => adminService.getMemberships().then(r => r.data.data) });

    const createMutation = useMutation({ mutationFn: adminService.createMembership, onSuccess: () => { qc.invalidateQueries(['admin', 'memberships']); setModal(null); toast.success('Plan created!'); }, onError: (e) => toast.error(e?.response?.data?.message) });
    const updateMutation = useMutation({ mutationFn: ({ id, data }) => adminService.updateMembership(id, data), onSuccess: () => { qc.invalidateQueries(['admin', 'memberships']); setModal(null); toast.success('Plan updated!'); } });
    const deleteMutation = useMutation({ mutationFn: adminService.deleteMembership, onSuccess: () => { qc.invalidateQueries(['admin', 'memberships']); toast.success('Plan archived.'); } });

    return (
        <div>
            <PageHeader title="Membership Plans" subtitle="Create and manage subscription plans">
                <button className="btn btn-primary" onClick={() => setModal({ type: 'create' })}><Plus size={16} /> Add Plan</button>
            </PageHeader>

            {isLoading ? <LoadingCenter /> : (
                <div className="grid-3">
                    {(plans || []).length === 0 && <EmptyState title="No plans yet" message="Create your first membership plan." />}
                    {(plans || []).map((plan) => (
                        <div key={plan._id} className="card" style={{ position: 'relative' }}>
                            <div className="flex justify-between items-center mb-2">
                                <Badge status={plan.badge} />
                                <div className="flex gap-2">
                                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal({ type: 'edit', data: { ...plan, features: plan.features.join(', ') } })}><Edit2 size={14} /></button>
                                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteMutation.mutate(plan._id)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mt-2">{plan.name}</h3>
                            <p className="text-3xl font-bold mt-1" style={{ color: 'var(--primary)' }}>{fmtCurrency(plan.price)}</p>
                            <p className="text-sm text-muted">{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</p>
                            <ul className="flex-col gap-1 mt-4">
                                {plan.features.map((f, i) => <li key={i} className="text-sm text-muted" style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--accent)' }}>✓</span>{f}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {modal?.type === 'create' && <PlanModal onClose={() => setModal(null)} onSave={(d) => createMutation.mutate(d)} />}
            {modal?.type === 'edit' && <PlanModal initialData={modal.data} onClose={() => setModal(null)} onSave={(d) => updateMutation.mutate({ id: modal.data._id, data: d })} />}
        </div>
    );
}
