import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import { toast } from 'react-toastify';

const AdminFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        axios.get('/api/feedback/all').then(r => { setFeedbacks(r.data.feedbacks); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        try {
            await axios.delete(`/api/feedback/${id}`);
            toast.success('Feedback deleted successfully');
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete feedback');
        }
    };

    const avg = feedbacks.length
        ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
        : '—';

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h1>All Feedbacks</h1>
                    <p>Attendee reviews and ratings for events</p>
                </div>

                <div className="grid-2" style={{ marginBottom: '2rem', maxWidth: '500px' }}>
                    <div className="stat-card">
                        <span className="stat-label">Total Reviews</span>
                        <span className="stat-value">{feedbacks.length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Average Rating</span>
                        <span className="stat-value">⭐ {avg}</span>
                    </div>
                </div>

                <div className="card">
                    {loading ? <div className="spinner" /> : feedbacks.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon">💬</div><p>No feedbacks yet</p></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {feedbacks.map(f => (
                                <div key={f._id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>{f.userId?.name || 'User'}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginLeft: '0.6rem' }}>{f.userId?.email}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(f.createdAt).toLocaleDateString()}</div>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f._id)}>🗑️ Delete</button>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Event: <strong style={{ color: 'var(--text-primary)' }}>{f.paymentId?.eventName}</strong></div>
                                    <StarRating value={f.rating} readOnly />
                                    {f.comment && <p style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)', borderLeft: '3px solid var(--accent)', paddingLeft: '0.75rem' }}>{f.comment}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminFeedbacks;
