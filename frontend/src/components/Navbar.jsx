import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/login'); };

    const adminLinks = [
        { label: '📊 Dashboard', to: '/admin' },
        { label: '➕ Record', to: '/admin/record' },
        { label: '🧾 All Payments', to: '/admin/payments' },
        { label: '💬 Feedbacks', to: '/admin/feedbacks' },
    ];
    const userLinks = [
        { label: '🏠 Dashboard', to: '/user' },
        { label: '💳 Pay', to: '/user/pay' },
        { label: '📋 History', to: '/user/history' },
        { label: '⭐ Feedback', to: '/user/feedback' },
        { label: '👤 Profile', to: '/user/profile' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <nav className="navbar">
            <div className="nav-inner">
                <span className="nav-logo" onClick={() => navigate(isAdmin ? '/admin' : '/user')}>
                    💸 GatherUp
                </span>
                <div className="nav-links">
                    {links.map(l => (
                        <button
                            key={l.to}
                            className={`nav-link${location.pathname === l.to ? ' active' : ''}`}
                            onClick={() => navigate(l.to)}
                        >
                            {l.label}
                        </button>
                    ))}
                    <span className="nav-role-badge">{user?.role}</span>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
