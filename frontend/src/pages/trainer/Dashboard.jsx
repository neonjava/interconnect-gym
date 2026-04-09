import { useQuery } from '@tanstack/react-query';
import { Users, Dumbbell, UtensilsCrossed, Calendar } from 'lucide-react';
import { trainerService } from '../../services/index.js';
import { StatCard, LoadingCenter, PageHeader } from '../../components/shared/index.jsx';

export default function TrainerDashboard() {
    const { data: members, isLoading: loadingMembers } = useQuery({
        queryKey: ['trainer', 'my-members'],
        queryFn: () => trainerService.getMyMembers().then(r => r.data.data)
    });

    if (loadingMembers) return <LoadingCenter />;

    const activeMembers = members?.filter(m => m.userId?.isActive).length || 0;

    return (
        <div>
            <PageHeader title="Trainer Dashboard" subtitle="Track your assigned members and their plans." />

            <div className="grid-4 mb-6">
                <StatCard
                    icon={Users}
                    label="My Members"
                    value={members?.length || 0}
                    iconBg="rgba(59, 130, 246, 0.12)"
                    iconColor="var(--info)"
                />
                <StatCard
                    icon={Users}
                    label="Active This Week"
                    value={activeMembers}
                    iconBg="rgba(16, 185, 129, 0.12)"
                    iconColor="var(--accent)"
                />
                <StatCard
                    icon={Dumbbell}
                    label="Workout Plans"
                    value="—"
                    iconBg="rgba(124, 58, 237, 0.12)"
                    iconColor="var(--primary)"
                />
                <StatCard
                    icon={UtensilsCrossed}
                    label="Diet Plans"
                    value="—"
                    iconBg="rgba(245, 158, 11, 0.12)"
                    iconColor="var(--warning)"
                />
            </div>

            <div className="card">
                <h3 className="text-lg font-bold mb-4">Assigned Members</h3>
                {members?.length === 0 ? (
                    <p className="text-muted">You have no members assigned yet.</p>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Member</th>
                                    <th>Goal</th>
                                    <th>Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members?.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="sidebar__avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                                                    {p.userId?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{p.userId?.name}</div>
                                                    <div className="text-xs text-muted">{p.userId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-sm font-medium">{p.goal || 'No goal set'}</td>
                                        <td className="text-sm text-muted">{new Date(p.joinDate).toLocaleDateString()}</td>
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
