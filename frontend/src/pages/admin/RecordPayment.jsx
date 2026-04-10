import { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const RecordPayment = () => {
    const [form, setForm] = useState({ userId: '', eventName: '', amount: '', method: 'card', transactionId: '', notes: '', status: 'completed' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/admin/payments', { ...form, amount: Number(form.amount) });
            toast.success('Payment recorded successfully!');
            setSuccess(data.payment._id);
            setForm({ userId: '', eventName: '', amount: '', method: 'card', transactionId: '', notes: '', status: 'completed' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h1>Record Payment</h1>
                    <p>Manually record a payment on behalf of an attendee</p>
                </div>
                {success && (
                    <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        ✅ Payment recorded! ID: <code style={{ fontSize: '0.8rem' }}>{success}</code>
                        <a href={`/api/admin/payments/${success}/receipt?token=${token}`} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">🧾 Download Receipt</a>
                    </div>
                )}
                <div className="card" style={{ maxWidth: '640px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>User ID</label>
                                <input id="rp-userId" placeholder="MongoDB ObjectId of user" value={form.userId}
                                    onChange={e => setForm(p => ({ ...p, userId: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Event Name</label>
                                <input id="rp-event" placeholder="e.g. Tech Conference 2024" value={form.eventName}
                                    onChange={e => setForm(p => ({ ...p, eventName: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Amount (Rs.)</label>
                                <input id="rp-amount" type="number" min="1" placeholder="500" value={form.amount}
                                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Payment Method</label>
                                <select id="rp-method" value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}>
                                    <option value="card">Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="netbanking">Net Banking</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Transaction ID</label>
                                <input id="rp-txn" placeholder="Optional" value={form.transactionId}
                                    onChange={e => setForm(p => ({ ...p, transactionId: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select id="rp-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea id="rp-notes" placeholder="Additional notes (optional)" value={form.notes}
                                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} />
                        </div>
                        <button id="rp-submit" type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Recording…' : '💾 Record Payment'}
                        </button>
                    </form>
                </div>
            </div >
        </>
    );
};

export default RecordPayment;
