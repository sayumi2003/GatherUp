import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [cardForm, setCardForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('/api/user/profile');
            setUser(data.user);
            setCards(data.user.savedCards || []);
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/user/cards', cardForm);
            setCards(data.cards);
            setShowForm(false);
            setCardForm({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
            toast.success('Card added successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add card');
        }
    };

    if (loading) return <div className="page" style={{ paddingTop: '80px', textAlign: 'center' }}>Loading...</div>;

    return (
        <>
            <div className="hero-bg" />
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h1>My Profile</h1>
                    <p>Manage your details and saved payment methods</p>
                </div>

                <div className="card" style={{ maxWidth: '640px', marginBottom: '2rem' }}>
                    <h3>👤 User Details</h3>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                </div>

                <div className="card" style={{ maxWidth: '640px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>💳 Saved Cards</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Cancel' : '➕ Add Card Details'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleAddCard} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label>Card Name (e.g., My Visa)</label>
                                <input value={cardForm.cardName} onChange={e => setCardForm(p => ({ ...p, cardName: e.target.value }))} placeholder="Optional" />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input value={cardForm.cardNumber} onChange={e => setCardForm(p => ({ ...p, cardNumber: e.target.value }))} required maxLength="16" placeholder="1234567812345678" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Expiry (MM/YY)</label>
                                        <input value={cardForm.expiry} onChange={e => setCardForm(p => ({ ...p, expiry: e.target.value }))} required placeholder="12/26" autoComplete="cc-exp" />
                                    </div>
                                    <div className="form-group">
                                        <label>CVV</label>
                                        <input value={cardForm.cvv} onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))} required type="text" maxLength="3" placeholder="123" autoComplete="cc-csc" />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>💾 Save Card</button>
                        </form>
                    )}

                    {cards.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No saved cards found.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cards.map((card, i) => (
                                <div key={i} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{card.cardName || 'Card'}</strong>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                            **** **** **** {card.cardNumber.slice(-4)} | Expires: {card.expiry}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
