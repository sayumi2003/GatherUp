import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/admin/payments').then(r => {
            setPayments(r.data.payments);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const total = payments.length;
    const revenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const refunded = payments.filter(p => p.status === 'refunded').length;
    const pending = payments.filter(p => p.status === 'pending').length;

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h1>Admin Dashboard</h1>
                    <p>Overview of all payments and system activity</p>
                </div>

                <div className="grid-3" style={{ marginBottom: '2rem' }}>
                    {[
                        { icon: '💳', label: 'Total Payments', value: total },
                        { icon: '💰', label: 'Revenue (Completed)', value: `Rs.${revenue.toLocaleString()}` },
                        { icon: '↩️', label: 'Refunds', value: refunded },
                    ].map(s => (
                        <div className="stat-card" key={s.label}>
                            <span className="stat-icon">{s.icon}</span>
                            <span className="stat-label">{s.label}</span>
                            <span className="stat-value">{s.value}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/admin/record')}>➕ Record Payment</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/admin/payments')}>📋 View All Payments</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/admin/feedbacks')}>💬 View Feedbacks</button>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Recent Payments</h3>
                    {loading ? <div className="spinner" /> : (
                        payments.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">📭</div><p>No payments recorded yet</p></div>
                        ) : (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr><th>Attendee</th><th>Event</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {payments.slice(0, 5).map(p => (
                                            <tr key={p._id}>
                                                <td>{p.userId?.name || '—'}</td>
                                                <td>{p.eventName}</td>
                                                <td>Rs.{p.amount.toLocaleString()}</td>
                                                <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/edit/${p._id}`)}>Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
