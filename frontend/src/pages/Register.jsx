import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/register', form);
            login(data.token, data.user);
            toast.success(`Account created! Welcome, ${data.user.name}!`);
            navigate(data.user.role === 'admin' ? '/admin' : '/user', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div className="hero-bg" />
            <div style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💸</div>
                    <h1 style={{ background: 'linear-gradient(135deg, #9d82ff, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>GatherUp</h1>
                    <p>Create your account</p>
                </div>
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input id="reg-name" type="text" placeholder="Sayumi Halwala" value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input id="reg-email" type="email" placeholder="you@example.com" value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input id="reg-password" type="password" placeholder="••••••••" value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select id="reg-role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                                <option value="user">User (Attendee)</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button id="reg-submit" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
                            {loading ? 'Creating account…' : 'Create Account →'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
