import { useQuery } from '@tanstack/react-query';
import { trainerService } from '../../services/index.js';
import { LoadingCenter, PageHeader, getInitials, fmtDate } from '../../components/shared/index.jsx';

export default function TrainerMyMembers() {
    const { data: members, isLoading } = useQuery({
        queryKey: ['trainer', 'my-members'],
        queryFn: () => trainerService.getMyMembers().then(r => r.data.data)
    });

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="My Members" subtitle="Manage members assigned to you." />

            <div className="grid-3">
                {members?.map(p => (
                    <div key={p._id} className="card">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="sidebar__avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>
                                {getInitials(p.userId?.name)}
                            </div>
                            <div>
                                <h3 className="font-bold">{p.userId?.name}</h3>
                                <p className="text-sm text-muted">{p.userId?.email}</p>
                            </div>
                        </div>

                        <div className="flex-col gap-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Goal</span>
                                <span className="font-medium">{p.goal || '—'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Weight</span>
                                <span className="font-medium">{p.weight ? `${p.weight} kg` : '—'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Height</span>
                                <span className="font-medium">{p.height ? `${p.height} cm` : '—'}</span>
                            </div>
                        </div>

                        <button className="btn btn-ghost w-full">View Details</button>
                    </div>
                ))}
                {members?.length === 0 && (
                    <div className="text-center p-8 border border-dashed rounded-lg col-span-full">
                        <p className="text-muted">No members assigned to you.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
