import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Spinner } from '../../components/shared/index.jsx';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const ROLE_HOME = { admin: '/admin', trainer: '/trainer', member: '/member' };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please fill in all fields.'); return; }
        try {
            const user = await login(email, password);
            navigate(ROLE_HOME[user.role] || '/member');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__logo">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Dumbbell size={28} color="var(--primary)" />
                    </div>
                    <h1><span>Strength</span> Arena</h1>
                    <p>Sign in to your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <input id="email" type="email" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <input id="password" type={showPwd ? 'text' : 'password'} className="form-input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                                placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="button" onClick={() => setShowPwd(!showPwd)}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0 }}>
                                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Forgot password?</Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : 'Sign In'}
                    </button>
                </form>

                <div className="auth-form__footer mt-4">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Demo Credentials:</strong><br />
                    Admin: admin@strengtharena.com / Admin@123<br />
                    Trainer: trainer@strengtharena.com / Trainer@123<br />
                    Member: arjun@example.com / Member@123
                </div>
            </div>
        </div>
    );
}
