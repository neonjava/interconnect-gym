import { useQuery } from '@tanstack/react-query';
import { Dumbbell, UtensilsCrossed, Calendar, Bell } from 'lucide-react';
import { memberService } from '../../services/index.js';
import { StatCard, LoadingCenter, PageHeader } from '../../components/shared/index.jsx';

export default function MemberDashboard() {
    const { data: dash, isLoading } = useQuery({
        queryKey: ['member', 'dashboard'],
        queryFn: () => memberService.getDashboard().then(r => r.data.data)
    });

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader
                title="Welcome Back!"
                subtitle="Stay consistent and reach your fitness goals."
            />

            <div className="grid-4 mb-6">
                <StatCard
                    icon={Calendar}
                    label="Attendance Streak"
                    value={dash?.attendanceCount || 0}
                    iconBg="rgba(16, 185, 129, 0.12)"
                    iconColor="var(--accent)"
                />
                <StatCard
                    icon={Dumbbell}
                    label="Active Workout"
                    value={dash?.workoutPlan?.title || 'None'}
                    iconBg="rgba(124, 58, 237, 0.12)"
                    iconColor="var(--primary)"
                />
                <StatCard
                    icon={UtensilsCrossed}
                    label="Daily Calories"
                    value={dash?.dietPlan?.dailyCalories ? `${dash.dietPlan.dailyCalories} kcal` : 'None'}
                    iconBg="rgba(245, 158, 11, 0.12)"
                    iconColor="var(--warning)"
                />
                <StatCard
                    icon={Bell}
                    label="Notifications"
                    value={dash?.unreadNotifications || 0}
                    iconBg="rgba(59, 130, 246, 0.12)"
                    iconColor="var(--info)"
                />
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Current Subscription</h3>
                    {dash?.subscription ? (
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-muted">Plan</span>
                                <span className="font-bold">{dash.subscription.membershipId?.name}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-muted">Status</span>
                                <span className="badge badge-active">{dash.subscription.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Expires</span>
                                <span className="font-medium text-danger">
                                    {new Date(dash.subscription.endDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted">No active subscription found.</p>
                    )}
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                    <div className="flex-col gap-2">
                        <button className="btn btn-primary w-full">Track Workout</button>
                        <button className="btn btn-ghost w-full">Log My Meals</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
