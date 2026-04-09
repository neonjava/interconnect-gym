import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { adminService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState } from '../../components/shared/index.jsx';
import { fmtDate, getInitials } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

function TrainerModal({ onClose, onSave }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal__header"><h2>Add Trainer</h2><button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>✕</button></div>
                <div className="modal__body flex-col gap-4">
                    {['name', 'email', 'phone'].map(f => <div className="form-group" key={f}><label className="form-label">{f.charAt(0).toUpperCase() + f.slice(1)}</label><input className="form-input" type={f === 'email' ? 'email' : 'text'} value={form[f]} onChange={set(f)} /></div>)}
                    <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={set('password')} /></div>
                </div>
                <div className="modal__footer"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => onSave(form)}>Create Trainer</button></div>
            </div>
        </div>
    );
}

export default function AdminTrainers() {
    const [showModal, setShowModal] = useState(false);
    const qc = useQueryClient();
    const { data: trainers, isLoading } = useQuery({ queryKey: ['admin', 'trainers'], queryFn: () => adminService.getTrainers().then(r => r.data.data) });
    const createMutation = useMutation({ mutationFn: adminService.createTrainer, onSuccess: () => { qc.invalidateQueries(['admin', 'trainers']); setShowModal(false); toast.success('Trainer created!'); }, onError: (e) => toast.error(e?.response?.data?.message) });

    return (
        <div>
            <PageHeader title="Trainers" subtitle="Manage the training team">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Trainer</button>
            </PageHeader>

            {isLoading ? <LoadingCenter /> : (
                <div className="grid-3">
                    {!(trainers?.length) && <EmptyState title="No trainers yet" />}
                    {(trainers || []).map(t => (
                        <div key={t._id} className="card flex items-center gap-4">
                            <div className="sidebar__avatar" style={{ width: 52, height: 52, fontSize: '1.125rem', flexShrink: 0 }}>{getInitials(t.name)}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="font-semibold">{t.name}</div>
                                <div className="text-sm text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.email}</div>
                                {t.phone && <div className="text-xs text-muted mt-1">{t.phone}</div>}
                                <div className="text-xs text-muted mt-1">Joined {fmtDate(t.createdAt)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showModal && <TrainerModal onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
        </div>
    );
}
