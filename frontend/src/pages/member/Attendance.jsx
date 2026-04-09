import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Calendar } from 'lucide-react';
import { memberService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState, fmtDateTime } from '../../components/shared/index.jsx';
import toast from 'react-hot-toast';

export default function MemberAttendance() {
    const qc = useQueryClient();
    const { data: records, isLoading } = useQuery({
        queryKey: ['member', 'attendance'],
        queryFn: () => memberService.getAttendance().then(r => r.data.data)
    });

    const checkInMutation = useMutation({
        mutationFn: () => memberService.checkIn(),
        onSuccess: () => {
            qc.invalidateQueries(['member', 'attendance']);
            qc.invalidateQueries(['member', 'dashboard']);
            toast.success('Successfully checked in!');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Check-in failed');
        }
    });

    if (isLoading) return <LoadingCenter />;

    const today = new Date().toISOString().split('T')[0];
    const checkedInToday = records?.some(r => r.date.split('T')[0] === today);

    return (
        <div>
            <PageHeader title="Attendance" subtitle="Track your gym visits." />

            <div className="card mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Check-in Today</h3>
                        <p className="text-sm text-muted">Scan QR at reception or click check-in button.</p>
                    </div>
                    <button
                        className={`btn btn-lg ${checkedInToday ? 'btn-ghost' : 'btn-primary'}`}
                        disabled={checkedInToday || checkInMutation.isPending}
                        onClick={() => checkInMutation.mutate()}
                    >
                        {checkedInToday ? (
                            <><CheckCircle2 size={20} /> Checked-in</>
                        ) : (
                            'Check-in Now'
                        )}
                    </button>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-bold mb-4">My Visit History</h3>
                {records?.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No history"
                        message="Your gym visits will appear here."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Check-in Time</th>
                                    <th>Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records?.map((r, idx) => (
                                    <tr key={idx}>
                                        <td>{new Date(r.date).toLocaleDateString()}</td>
                                        <td>{new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td><span className="badge badge-basic">{r.markedBy}</span></td>
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
