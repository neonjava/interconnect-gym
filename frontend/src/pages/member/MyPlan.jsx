import { useQuery } from '@tanstack/react-query';
import { Dumbbell } from 'lucide-react';
import { memberService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState } from '../../components/shared/index.jsx';

export default function MemberMyPlan() {
    const { data: plan, isLoading } = useQuery({
        queryKey: ['member', 'workout-plan'],
        queryFn: () => memberService.getWorkoutPlan().then(r => r.data.data)
    });

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="My Workout Plan" subtitle="Follow your personalized training routine." />

            {plan ? (
                <div className="flex-col gap-6">
                    <div className="card">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{plan.title}</h2>
                                <div className="flex gap-2 mt-2">
                                    <span className="badge badge-primary">{plan.level}</span>
                                    <span className="badge badge-basic">{plan.weeks} Weeks</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-muted">{plan.description}</p>
                    </div>

                    <div className="grid-1 gap-6">
                        {plan.days?.map((day, idx) => (
                            <div key={idx} className="card">
                                <h3 className="text-lg font-bold mb-4 text-primary">{day.dayName}</h3>
                                {day.isRestDay ? (
                                    <p className="text-muted italic">Enjoy your rest day!</p>
                                ) : (
                                    <div className="table-wrap">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Exercise</th>
                                                    <th>Sets</th>
                                                    <th>Reps/Time</th>
                                                    <th>Rest</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {day.exercises?.map((ex, eIdx) => (
                                                    <tr key={eIdx}>
                                                        <td className="font-medium">{ex.name}</td>
                                                        <td>{ex.sets || '—'}</td>
                                                        <td>{ex.reps || ex.duration || '—'}</td>
                                                        <td>{ex.rest || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={Dumbbell}
                    title="No Workout Plan"
                    message="Your trainer hasn't assigned a workout plan to you yet."
                />
            )}
        </div>
    );
}
