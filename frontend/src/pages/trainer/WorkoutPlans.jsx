import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Dumbbell, Trash2 } from 'lucide-react';
import { trainerService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState } from '../../components/shared/index.jsx';
import toast from 'react-hot-toast';

export default function WorkoutPlans() {
    const qc = useQueryClient();
    const { data: plans, isLoading } = useQuery({
        queryKey: ['trainer', 'workout-plans'],
        queryFn: () => trainerService.getWorkoutPlans().then(r => r.data.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => trainerService.deleteWorkoutPlan(id),
        onSuccess: () => {
            qc.invalidateQueries(['trainer', 'workout-plans']);
            toast.success('Workout plan deleted');
        }
    });

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="Workout Plans" subtitle="Create and assign workout plans.">
                <button className="btn btn-primary">
                    <Plus size={16} /> New Plan
                </button>
            </PageHeader>

            <div className="grid-3">
                {plans?.map(p => (
                    <div key={p._id} className="card">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold">{p.title}</h3>
                                <p className="text-sm text-muted">For: {p.memberId?.name}</p>
                            </div>
                            <button
                                className="btn btn-danger btn-sm btn-icon"
                                onClick={() => deleteMutation.mutate(p._id)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <span className="badge badge-primary">{p.level}</span>
                            <span className="badge badge-basic ml-2">{p.weeks} Weeks</span>
                        </div>

                        <p className="text-sm text-muted mb-4 line-clamp-2">
                            {p.description || 'No description provided.'}
                        </p>

                        <button className="btn btn-ghost w-full">Edit Plan</button>
                    </div>
                ))}
                {plans?.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState
                            icon={Dumbbell}
                            title="No workout plans"
                            message="You haven't created any workout plans yet."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
