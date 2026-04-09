import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrendingUp, Plus } from 'lucide-react';
import { memberService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState, fmtDate } from '../../components/shared/index.jsx';
import toast from 'react-hot-toast';

export default function MemberProgress() {
    const qc = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ weight: '', bodyFat: '', notes: '' });

    const { data: logs, isLoading } = useQuery({
        queryKey: ['member', 'progress'],
        queryFn: () => memberService.getProgress().then(r => r.data.data)
    });

    const addMutation = useMutation({
        mutationFn: (data) => memberService.addProgress({ ...data, logDate: new Date() }),
        onSuccess: () => {
            qc.invalidateQueries(['member', 'progress']);
            setShowForm(false);
            setForm({ weight: '', bodyFat: '', notes: '' });
            toast.success('Progress logged!');
        }
    });

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="Progress Tracking" subtitle="Monitor your transformations.">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={16} /> Log Entry
                </button>
            </PageHeader>

            {showForm && (
                <div className="card mb-8 slide-up">
                    <h3 className="text-lg font-bold mb-4">Add Log Entry</h3>
                    <div className="grid-3 mb-4">
                        <div className="form-group">
                            <label className="form-label">Weight (kg)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={form.weight}
                                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Body Fat (%)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={form.bodyFat}
                                onChange={(e) => setForm({ ...form, bodyFat: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Feeling stronger..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => addMutation.mutate(form)}
                            disabled={addMutation.isPending}
                        >
                            Save Entry
                        </button>
                        <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="card">
                <h3 className="text-lg font-bold mb-4">History</h3>
                {logs?.length === 0 ? (
                    <EmptyState
                        icon={TrendingUp}
                        title="No progress logs"
                        message="Start logging your metrics to see trends."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Weight</th>
                                    <th>Body Fat</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs?.map((log, idx) => (
                                    <tr key={idx}>
                                        <td className="font-medium">{fmtDate(log.logDate)}</td>
                                        <td>{log.weight} kg</td>
                                        <td>{log.bodyFat || '—'} %</td>
                                        <td className="text-muted text-sm">{log.notes || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
