import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const eventAmounts = {
    'Viramaya': 500,
    'Aloka warsha': 1000,
    'Annual Get Together': 1500,
    'Handawa': 2000
};

const MakePayment = () => {
    const [form, setForm] = useState({ eventName: '', amount: '', method: 'card' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const { data } = await axios.get('/api/user/profile');
                if (data.user?.savedCards?.length > 0) {
                    setSavedCards(data.user.savedCards);
                    setSelectedCardId('0');
                }
            } catch (err) { }
        };
        fetchCards();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/payments', { ...form, amount: Number(form.amount) });
            toast.success('Payment successful! 🎉');
            setSuccess(data.payment);
            setForm({ eventName: '', amount: '', method: 'card' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment failed');
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
                    <h1>Make a Payment</h1>
                    <p>Pay for your event registration securely</p>
                </div>

                {success && (
                    <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span>🎉 Payment for <strong>{success.eventName}</strong> completed! Txn: {success.transactionId}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a href={`/api/user/payments/${success._id}/receipt?token=${token}`} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">🧾 Receipt</a>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/user/feedback')}>⭐ Leave Feedback</button>
                        </div>
                    </div>
                )}

                <div className="card" style={{ maxWidth: '520px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Event Name</label>
                            <select id="mp-event" value={form.eventName}
                                onChange={e => {
                                    const eventName = e.target.value;
                                    const amount = eventAmounts[eventName] || '';
                                    setForm(p => ({ ...p, eventName, amount }));
                                }} required>
                                <option value="" disabled>Select an event</option>
                                <option value="Viramaya">Viramaya</option>
                                <option value="Aloka warsha">Aloka warsha</option>
                                <option value="Annual Get Together">Annual Get Together</option>
                                <option value="Handawa">Handawa</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount (Rs.)</label>
                            <input id="mp-amount" type="number" min="1" placeholder="500" value={form.amount}
                                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label>Payment Method</label>
                            <select id="mp-method" value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}>
                                <option value="card">💳 Credit / Debit Card</option>
                                <option value="upi">📱 UPI</option>
                                <option value="netbanking">🏦 Net Banking</option>
                                <option value="cash">💵 Cash</option>
                            </select>
                        </div>

                        {form.method === 'card' && savedCards.length > 0 && (
                            <div className="form-group" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem' }}>
                                <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Select Saved Card</label>
                                <select value={selectedCardId} onChange={e => setSelectedCardId(e.target.value)}>
                                    {savedCards.map((card, idx) => (
                                        <option key={idx} value={idx}>
                                            {card.cardName || 'Card'} (**** {card.cardNumber.slice(-4)})
                                        </option>
                                    ))}
                                    <option value="new">➕ Use another card</option>
                                </select>
                            </div>
                        )}

                        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.2rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                            🔒 Secure payment powered by GatherUp. Your transaction ID will be auto-generated.
                        </div>

                        <button id="mp-submit" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                            {loading ? 'Processing…' : '💳 Pay Now'}
                        </button>
                    </form>
                </div>
            </div >
        </>
    );
};

export default MakePayment;
