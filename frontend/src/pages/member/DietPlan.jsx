import { useQuery } from '@tanstack/react-query';
import { UtensilsCrossed } from 'lucide-react';
import { memberService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState } from '../../components/shared/index.jsx';

export default function MemberDietPlan() {
    const { data: plan, isLoading } = useQuery({
        queryKey: ['member', 'diet-plan'],
        queryFn: () => memberService.getDietPlan().then(r => r.data.data)
    });

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="Diet Plan" subtitle="Nutrition fuel for your performance." />

            {plan ? (
                <div className="flex-col gap-6">
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                        <div className="flex gap-4 mb-4">
                            <div className="flex-col">
                                <span className="text-xs text-muted uppercase font-bold">Daily Target</span>
                                <span className="text-xl font-bold text-primary">{plan.dailyCalories} kcal</span>
                            </div>
                            <div className="flex-col">
                                <span className="text-xs text-muted uppercase font-bold">Protein</span>
                                <span className="text-xl font-bold">{plan.protein}g</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid-2">
                        {plan.meals?.map((meal, idx) => (
                            <div key={idx} className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">{meal.mealName}</h3>
                                    <span className="text-sm text-muted">{meal.time}</span>
                                </div>
                                <ul className="flex-col gap-2">
                                    {meal.items?.map((item, iIdx) => (
                                        <li key={iIdx} className="flex justify-between text-sm py-2 border-b border-white/[0.05] last:border-0">
                                            <span>{item.food} <span className="text-muted ml-1">({item.quantity})</span></span>
                                            <span className="font-medium">{item.calories} kcal</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={UtensilsCrossed}
                    title="No Diet Plan"
                    message="Your trainer hasn't assigned a nutrition plan to you yet."
                />
            )}
        </div>
    );
}
