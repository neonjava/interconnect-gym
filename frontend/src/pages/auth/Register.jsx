import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, Phone, Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Spinner } from '../../components/shared/index.jsx';
import toast from 'react-hot-toast';

const Field = ({ id, label, icon: Icon, type = 'text', placeholder, value, onChange, required }) => (
    <div className="form-group">
        <label className="form-label" htmlFor={id}>{label}</label>
        <div style={{ position: 'relative' }}>
            <Icon size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input id={id} type={type} className="form-input" style={{ paddingLeft: '2.5rem' }}
                placeholder={placeholder} value={value} onChange={onChange} required={required} />
        </div>
    </div>
);

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return; }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
        try {
            await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
            navigate('/member');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '480px' }}>
                <div className="auth-card__logo">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Dumbbell size={28} color="var(--primary)" />
                    </div>
                    <h1><span>Strength</span> Arena</h1>
                    <p>Create your member account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <Field id="name" label="Full Name" icon={User} placeholder="Your full name" value={form.name} onChange={set('name')} required />
                    <Field id="email" label="Email Address" icon={Mail} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                    <Field id="phone" label="Phone Number" icon={Phone} placeholder="+91 9000000000" value={form.phone} onChange={set('phone')} />
                    <Field id="pwd" label="Password" icon={Lock} type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
                    <Field id="cpwd" label="Confirm Password" icon={Lock} type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>Or register with</span>
                </div>

                <div className="social-auth-grid">
                    <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                        <Chrome size={18} />
                        Google
                    </button>
                    <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.115.024-.233.033-.35.035-.117.002-.235-.005-.352-.022l-.121-.023c-.16-.035-.316-.091-.462-.167-.146-.075-.276-.179-.382-.303-.106-.123-.186-.264-.236-.416-.048-.152-.068-.31-.057-.468.012-.158.053-.312.122-.455.07-.142.167-.269.285-.373.118-.104.254-.185.402-.239.148-.054.305-.079.462-.075.141.004.281.029.414.075.133.045.258.115.367.204l1.107 1.107c.071.071.127.155.166.248.038.093.058.192.058.291 0 .1-.02.199-.058.291-.039.092-.095.177-.166.248L12.44 6.608c-.084.084-.184.151-.293.197-.109.046-.226.075-.345.086-.118.012-.238.007-.357-.013-.119-.02-.235-.054-.344-.103-.105-.047-.2-.112-.284-.191-.084-.079-.153-.173-.203-.277-.051-.104-.084-.217-.098-.333-.014-.116-.009-.234.015-.35l.024-.122a2.44 2.44 0 0 1 .462-.462c.15-.102.32-.174.5-.213l.352-.047c.189-.025.381-.019.567.018l.344.07c.174.035.339.106.484.208.145.101.267.231.358.38l.019.034c.091.149.149.314.171.488.021.173.007.35-.041.517z" /></svg>
                        Apple
                    </button>
                </div>

                <div className="auth-form__footer mt-4">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
