import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { adminService } from '../../services/index.js';
import { LoadingCenter, PageHeader, Badge, EmptyState } from '../../components/shared/index.jsx';
import { fmtDate, getInitials } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

function MemberModal({ onClose, onSave }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal__header"><h2>Add New Member</h2><button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>✕</button></div>
                <div className="modal__body flex-col gap-4">
                    {['name', 'email', 'phone'].map((f) => (
                        <div className="form-group" key={f}><label className="form-label">{f.charAt(0).toUpperCase() + f.slice(1)}</label><input className="form-input" type={f === 'email' ? 'email' : 'text'} value={form[f]} onChange={set(f)} /></div>
                    ))}
                    <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={set('password')} /></div>
                </div>
                <div className="modal__footer"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => onSave(form)}>Create Member</button></div>
            </div>
        </div>
    );
}

export default function AdminMembers() {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const qc = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'members', search],
        queryFn: () => adminService.getMembers({ search, limit: 50 }).then(r => r.data.data),
        debounce: 300,
    });

    const createMutation = useMutation({
        mutationFn: (d) => adminService.createMember(d),
        onSuccess: () => { qc.invalidateQueries(['admin', 'members']); setShowModal(false); toast.success('Member created!'); },
        onError: (e) => toast.error(e?.response?.data?.message || 'Failed to create member.'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => adminService.deleteMember(id),
        onSuccess: () => { qc.invalidateQueries(['admin', 'members']); toast.success('Member deactivated.'); },
    });

    return (
        <div>
            <PageHeader title="Members" subtitle="Manage all gym members">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Member</button>
            </PageHeader>

            <div className="card">
                <div className="search-input-wrap mb-4" style={{ maxWidth: 360 }}>
                    <Search size={16} />
                    <input className="form-input" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {isLoading ? <LoadingCenter /> : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead><tr><th>Member</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                            <tbody>
                                {(data?.members || []).length === 0 ? (
                                    <tr><td colSpan={5}><EmptyState title="No members found" /></td></tr>
                                ) : (data?.members || []).map((m) => (
                                    <tr key={m._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="sidebar__avatar" style={{ width: 36, height: 36, fontSize: '0.8125rem' }}>{getInitials(m.name)}</div>
                                                <div><div className="font-medium">{m.name}</div><div className="text-sm text-muted">{m.email}</div></div>
                                            </div>
                                        </td>
                                        <td className="text-muted">{m.phone || '—'}</td>
                                        <td><Badge status={m.isActive ? 'active' : 'expired'} /></td>
                                        <td className="text-muted text-sm">{fmtDate(m.createdAt)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-ghost btn-sm btn-icon"><Edit2 size={14} /></button>
                                                <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteMutation.mutate(m._id)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && <MemberModal onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
        </div>
    );
}
