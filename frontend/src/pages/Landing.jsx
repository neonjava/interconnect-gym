import { Link } from 'react-router-dom';
import { Dumbbell, Shield, Zap, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function Landing() {
    return (
        <div className="landing-page">
            {/* Header */}
            <header className="landing-nav">
                <div className="container flex justify-between items-center py-4">
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <Dumbbell size={28} color="var(--primary)" />
                        <span><span>Strength</span> Arena</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero py-20">
                <div className="container text-center">
                    <h1 className="hero-title mb-6">Elevate Your <span>Fitness</span> Journey</h1>
                    <p className="hero-subtitle mb-10 mx-auto max-w-2xl text-lg text-muted">
                        The all-in-one gym management platform for champions. Track your workouts, monitor your nutrition, and achieve your peak performance with Strength Arena.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn btn-primary btn-lg px-10">Join the Arena</Link>
                        <Link to="/login" className="btn btn-ghost btn-lg px-10">Sign In</Link>
                    </div>

                    <div className="hero-stats grid-3 mt-20">
                        <div className="stat">
                            <div className="stat-num">500+</div>
                            <div className="stat-label">Active Members</div>
                        </div>
                        <div className="stat">
                            <div className="stat-num">12+</div>
                            <div className="stat-label">Expert Trainers</div>
                        </div>
                        <div className="stat">
                            <div className="stat-num">100k+</div>
                            <div className="stat-label">Workouts Logged</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features py-24 bg-surface-1">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Master Your Management</h2>
                        <p className="text-muted">Everything you need to run a high-performance gym.</p>
                    </div>

                    <div className="grid-3 gap-8">
                        <FeatureCard
                            icon={Shield}
                            title="Membership Control"
                            desc="Comprehensive member management with automated billing and subscription tracking."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Personalized Plans"
                            desc="Trainers can create and assign dynamic workout and diet plans in real-time."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Advanced Analytics"
                            desc="Gain deep insights into revenue, member growth, and attendance trends."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta py-20">
                <div className="container text-center">
                    <div className="card glass p-12 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Gym?</h2>
                        <p className="text-muted mb-8">Join the elite gyms powered by Strength Arena's technology.</p>
                        <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-white/5">
                <div className="container text-center">
                    <p className="text-sm text-muted">© 2026 Strength Arena. Built with passion for fitness.</p>
                </div>
            </footer>

            <style>{`
        .landing-page { background: var(--bg); color: var(--text-primary); min-height: 100vh; font-family: 'Inter', sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .hero-title { font-size: 4.5rem; line-height: 1.1; font-weight: 800; letter-spacing: -0.05em; }
        .hero-title span { color: var(--primary); }
        .hero-stats .stat-num { font-size: 2.5rem; font-weight: 800; color: var(--accent); }
        .hero-stats .stat-label { font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .landing-nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
        @media (max-width: 768px) { .hero-title { font-size: 3rem; } }
      `}</style>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="card p-8 hover-glow transition-all duration-300">
            <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-muted leading-relaxed">{desc}</p>
        </div>
    );
}
