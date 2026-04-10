import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        axios.get('/api/user/payments').then(r => { setPayments(r.data.payments); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1>Payment History</h1>
                        <p>All your past and current payments</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/user/pay')}>💳 New Payment</button>
                </div>

                <div className="card">
                    {loading ? <div className="spinner" /> : payments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <p>No payment history found</p>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/user/pay')}>Make First Payment</button>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr><th>#</th><th>Event</th><th>Amount</th><th>Method</th><th>Transaction ID</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {payments.map((p, i) => (
                                        <tr key={p._id}>
                                            <td style={{ color: 'var(--text-secondary)' }}>{i + 1}</td>
                                            <td style={{ fontWeight: 600 }}>{p.eventName}</td>
                                            <td style={{ color: 'var(--success)', fontWeight: 700 }}>Rs.{p.amount.toLocaleString()}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{p.method}</td>
                                            <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{p.transactionId || '—'}</td>
                                            <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <a href={`/api/user/payments/${p._id}/receipt?token=${token}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🧾 Receipt</a>
                                                    {p.status === 'completed' && (
                                                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/user/feedback', { state: { paymentId: p._id, eventName: p.eventName } })}>
                                                            ⭐ Review
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
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

export default PaymentHistory;
