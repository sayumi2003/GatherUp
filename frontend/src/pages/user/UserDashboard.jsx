import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user, token } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/user/payments').then(r => { setPayments(r.data.payments); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const completed = payments.filter(p => p.status === 'completed');
    const totalSpent = completed.reduce((s, p) => s + p.amount, 0);

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h1>Welcome, {user?.name}! 👋</h1>
                    <p>Your payment and feedback portal</p>
                </div>

                <div className="grid-3" style={{ marginBottom: '2rem' }}>
                    {[
                        { icon: '💳', label: 'Total Payments', value: payments.length },
                        { icon: '💰', label: 'Total Spent', value: `Rs.${totalSpent.toLocaleString()}` },
                        { icon: '✅', label: 'Completed', value: completed.length },
                    ].map(s => (
                        <div className="stat-card" key={s.label}>
                            <span className="stat-icon">{s.icon}</span>
                            <span className="stat-label">{s.label}</span>
                            <span className="stat-value">{s.value}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/user/pay')}>💳 Make a Payment</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/user/history')}>📋 Payment History</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/user/feedback')}>⭐ Submit Feedback</button>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
                    {loading ? <div className="spinner" /> : payments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎫</div>
                            <p>No payments yet. Make your first payment!</p>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/user/pay')}>Pay Now</button>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr><th>Event</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Receipt</th></tr>
                                </thead>
                                <tbody>
                                    {payments.slice(0, 4).map(p => (
                                        <tr key={p._id}>
                                            <td style={{ fontWeight: 600 }}>{p.eventName}</td>
                                            <td style={{ color: 'var(--success)', fontWeight: 700 }}>Rs.{p.amount.toLocaleString()}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{p.method}</td>
                                            <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td><a href={`/api/user/payments/${p._id}/receipt?token=${token}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🧾</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserDashboard;
