import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainerService } from '../../services/index.js';
import { LoadingCenter, PageHeader, getInitials } from '../../components/shared/index.jsx';
import toast from 'react-hot-toast';

export default function TrainerAttendance() {
    const [selectedMember, setSelectedMember] = useState('');
    const qc = useQueryClient();

    const { data: members, isLoading: loadingMembers } = useQuery({
        queryKey: ['trainer', 'my-members'],
        queryFn: () => trainerService.getMyMembers().then(r => r.data.data)
    });

    const markMutation = useMutation({
        mutationFn: (memberId) => trainerService.markAttendance({ memberId }),
        onSuccess: () => {
            toast.success('Attendance marked successfully');
            setSelectedMember('');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to mark attendance');
        }
    });

    if (loadingMembers) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="Attendance Tracking" subtitle="Mark manual attendance for members." />

            <div className="card" style={{ maxWidth: '500px' }}>
                <div className="form-group mb-4">
                    <label className="form-label">Select Member</label>
                    <select
                        className="form-input"
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                    >
                        <option value="">Choose a member...</option>
                        {members?.map(p => (
                            <option key={p.userId?._id} value={p.userId?._id}>
                                {p.userId?.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn btn-primary w-full"
                    disabled={!selectedMember || markMutation.isPending}
                    onClick={() => markMutation.mutate(selectedMember)}
                >
                    {markMutation.isPending ? 'Marking...' : 'Mark Present Today'}
                </button>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Today's Check-ins</h3>
                <p className="text-muted text-sm">Real-time check-in log would appear here.</p>
            </div>
        </div>
    );
}
