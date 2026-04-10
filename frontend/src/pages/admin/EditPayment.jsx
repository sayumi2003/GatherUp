import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditPayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axios.get('/api/admin/payments').then(r => {
            const p = r.data.payments.find(x => x._id === id);
            if (p) setForm({ eventName: p.eventName, amount: p.amount, method: p.method, transactionId: p.transactionId, notes: p.notes, status: p.status });
            else toast.error('Payment not found');
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`/api/admin/payments/${id}`, { ...form, amount: Number(form.amount) });
            toast.success('Payment updated!');
            navigate('/admin/payments');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h1>Edit Payment</h1>
                    <p>Update details for payment <code style={{ fontSize: '0.85rem', color: 'var(--accent-light)' }}>{id}</code></p>
                </div>
                {loading ? <div className="spinner" /> : !form ? (
                    <div className="alert alert-danger">Payment not found</div>
                ) : (
                    <div className="card" style={{ maxWidth: '640px' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Event Name</label>
                                    <input id="ep-event" value={form.eventName} onChange={e => setForm(p => ({ ...p, eventName: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label>Amount (Rs.)</label>
                                    <input id="ep-amount" type="number" min="1" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Method</label>
                                    <select id="ep-method" value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}>
                                        <option value="card">Card</option>
                                        <option value="upi">UPI</option>
                                        <option value="netbanking">Net Banking</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select id="ep-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Transaction ID</label>
                                <input id="ep-txn" value={form.transactionId} onChange={e => setForm(p => ({ ...p, transactionId: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea id="ep-notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button id="ep-save" type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving…' : '💾 Save Changes'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/payments')}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default EditPayment;
