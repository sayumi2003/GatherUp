import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', form);
            login(data.token, data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
            navigate(data.user.role === 'admin' ? '/admin' : '/user', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
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
                    <h1 style={{ background: 'linear-gradient(135deg, #9d82ff, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        GatherUp
                    </h1>
                    <p style={{ marginTop: '0.4rem' }}>Payment & Feedback Portal</p>
                </div>

                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input id="login-email" type="email" placeholder="you@example.com" value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input id="login-password" type="password" placeholder="••••••••" value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                        </div>
                        <button id="login-submit" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In →'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
