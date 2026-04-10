import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const SubmitFeedback = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [completedPayments, setCompletedPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(state?.paymentId || '');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);

    const resetForm = () => {
        setEditingFeedbackId(null);
        setRating(0);
        setComment('');
        setSelectedPayment('');
    };

    useEffect(() => {
        Promise.all([
            axios.get('/api/user/payments'),
            axios.get('/api/feedback'),
        ]).then(([pRes, fRes]) => {
            setCompletedPayments(pRes.data.payments.filter(p => p.status === 'completed'));
            setMyFeedbacks(fRes.data.feedbacks);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const alreadyReviewed = (pid) => myFeedbacks.some(f => (f.paymentId?._id === pid || f.paymentId === pid) && f._id !== editingFeedbackId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) return toast.warning('Please select a star rating');
        if (!selectedPayment) return toast.warning('Please select a payment to review');
        setSubmitting(true);
        try {
            if (editingFeedbackId) {
                await axios.put(`/api/feedback/mine/${editingFeedbackId}`, { rating, comment });
                toast.success('Feedback updated! ⭐');
            } else {
                await axios.post('/api/feedback', { paymentId: selectedPayment, rating, comment });
                toast.success('Feedback submitted! Thank you ⭐');
            }
            resetForm();
            const fRes = await axios.get('/api/feedback');
            setMyFeedbacks(fRes.data.feedbacks);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (f) => {
        setEditingFeedbackId(f._id);
        setSelectedPayment(f.paymentId?._id || f.paymentId);
        setRating(f.rating);
        setComment(f.comment);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await axios.delete(`/api/feedback/mine/${id}`);
            toast.success('Review deleted');
            if (editingFeedbackId === id) resetForm();
            const fRes = await axios.get('/api/feedback');
            setMyFeedbacks(fRes.data.feedbacks);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    const eligiblePayments = completedPayments.filter(p => !alreadyReviewed(p._id));
    const selectedEvent = completedPayments.find(p => p._id === selectedPayment);

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h1>Submit Feedback</h1>
                    <p>Share your experience for events you attended</p>
                </div>

                {loading ? <div className="spinner" /> : (
                    <div className="grid-2" style={{ alignItems: 'start' }}>
                        {/* Left: Form */}
                        <div>
                            {completedPayments.length === 0 ? (
                                <div className="card">
                                    <div className="alert alert-info">
                                        🔒 You need at least one <strong>completed payment</strong> to leave feedback.
                                    </div>
                                    <button className="btn btn-primary" onClick={() => navigate('/user/pay')}>💳 Make a Payment</button>
                                </div>
                            ) : eligiblePayments.length === 0 ? (
                                <div className="card">
                                    <div className="alert alert-success">✅ You have reviewed all your completed payments!</div>
                                </div>
                            ) : (
                                <div className="card" style={editingFeedbackId ? { border: '2px solid var(--accent)' } : {}}>
                                    <h3 style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {editingFeedbackId ? 'Edit Review' : 'Leave a Review'}
                                        {editingFeedbackId && <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>Cancel Edit</button>}
                                    </h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Select Payment / Event</label>
                                            <select id="fb-payment" value={selectedPayment} onChange={e => setSelectedPayment(e.target.value)} required disabled={!!editingFeedbackId}>
                                                <option value="">— Choose an event —</option>
                                                {eligiblePayments.map(p => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.eventName} — Rs.{p.amount} ({new Date(p.createdAt).toLocaleDateString()})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedEvent && (
                                            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem', fontSize: '0.88rem' }}>
                                                <strong>{selectedEvent.eventName}</strong> &nbsp;|&nbsp; Rs.{selectedEvent.amount} &nbsp;|&nbsp; <span className="badge badge-completed">completed</span>
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label>Your Rating</label>
                                            <StarRating value={rating} onChange={setRating} />
                                        </div>

                                        <div className="form-group">
                                            <label>Comments (optional)</label>
                                            <textarea id="fb-comment" placeholder="Share your experience with this event…" value={comment}
                                                onChange={e => setComment(e.target.value)} rows={4} />
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button id="fb-submit" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting || !rating || !selectedPayment}>
                                                {submitting ? 'Submitting…' : (editingFeedbackId ? '💾 Update Feedback' : '⭐ Submit Feedback')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Right: My Feedbacks */}
                        <div>
                            <div className="card">
                                <h3 style={{ marginBottom: '1rem' }}>My Reviews</h3>
                                {myFeedbacks.length === 0 ? (
                                    <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                                        <div className="empty-icon">💬</div>
                                        <p>No reviews submitted yet</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {myFeedbacks.map(f => (
                                            <div key={f._id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                                    <div style={{ fontWeight: 600 }}>{f.paymentId?.eventName || 'Event'}</div>
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(f)}>✏️</button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f._id)}>🗑️</button>
                                                    </div>
                                                </div>
                                                <StarRating value={f.rating} readOnly />
                                                {f.comment && <p style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>{f.comment}</p>}
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                                                    {new Date(f.createdAt).toLocaleDateString()} {f.createdAt !== f.updatedAt && '(Edited)'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SubmitFeedback;
