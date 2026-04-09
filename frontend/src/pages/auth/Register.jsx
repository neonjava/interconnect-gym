import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, Phone } from 'lucide-react';
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

                <div className="auth-form__footer mt-4">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
