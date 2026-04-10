import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AllPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useAuth();

    const load = () => {
        setLoading(true);
        axios.get('/api/admin/payments').then(r => { setPayments(r.data.payments); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(load, []);

    const handleRefund = async (id) => {
        const reason = prompt('Enter refund reason:');
        if (reason === null) return;
        try {
            await axios.post(`/api/admin/payments/${id}/refund`, { refundReason: reason });
            toast.success('Payment refunded!');
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Refund failed');
        }
    };

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1>All Payments</h1>
                        <p>Manage and overview every payment in the system</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/admin/record')}>➕ Record New</button>
                </div>

                <div className="card">
                    {loading ? <div className="spinner" /> : payments.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon">📭</div><p>No payments found</p></div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr><th>Attendee</th><th>Event</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {payments.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{p.userId?.name || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.userId?.email}</div>
                                            </td>
                                            <td>{p.eventName}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--success)' }}>Rs.{p.amount.toLocaleString()}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{p.method}</td>
                                            <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/edit/${p._id}`)}>✏️ Edit</button>
                                                    <a href={`/api/admin/payments/${p._id}/receipt?token=${token}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🧾 Receipt</a>
                                                    {p.status !== 'refunded' && (
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleRefund(p._id)}>↩️ Refund</button>
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

export default AllPayments;
