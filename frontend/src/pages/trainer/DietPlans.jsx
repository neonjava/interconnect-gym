import { useQuery } from '@tanstack/react-query';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { trainerService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState } from '../../components/shared/index.jsx';

export default function DietPlans() {
    const { data: plans, isLoading } = useQuery({
        queryKey: ['trainer', 'diet-plans'],
        queryFn: () => trainerService.getDietPlans().then(r => r.data.data)
    });

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="Diet Plans" subtitle="Create and assign nutrition plans.">
                <button className="btn btn-primary">
                    <Plus size={16} /> New Diet Plan
                </button>
            </PageHeader>

            <div className="grid-3">
                {plans?.map(p => (
                    <div key={p._id} className="card">
                        <h3 className="text-lg font-bold mb-1">{p.title}</h3>
                        <p className="text-sm text-muted mb-4">For: {p.memberId?.name}</p>

                        <div className="flex gap-4 mb-4">
                            <div className="flex-col">
                                <span className="text-xs text-muted uppercase font-bold">Calories</span>
                                <span className="font-bold text-primary">{p.dailyCalories} kcal</span>
                            </div>
                            <div className="flex-col">
                                <span className="text-xs text-muted uppercase font-bold">Protein</span>
                                <span className="font-bold">{p.protein}g</span>
                            </div>
                        </div>

                        <button className="btn btn-ghost w-full">Edit Plan</button>
                    </div>
                ))}
                {plans?.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState
                            icon={UtensilsCrossed}
                            title="No diet plans"
                            message="You haven't created any diet plans yet."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
