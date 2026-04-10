import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import RecordPayment from './pages/admin/RecordPayment';
import AllPayments from './pages/admin/AllPayments';
import EditPayment from './pages/admin/EditPayment';
import AdminFeedbacks from './pages/admin/AdminFeedbacks';

// User
import UserDashboard from './pages/user/UserDashboard';
import MakePayment from './pages/user/MakePayment';
import PaymentHistory from './pages/user/PaymentHistory';
import SubmitFeedback from './pages/user/SubmitFeedback';
import Profile from './pages/user/Profile';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/record" element={<ProtectedRoute role="admin"><RecordPayment /></ProtectedRoute>} />
                    <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AllPayments /></ProtectedRoute>} />
                    <Route path="/admin/edit/:id" element={<ProtectedRoute role="admin"><EditPayment /></ProtectedRoute>} />
                    <Route path="/admin/feedbacks" element={<ProtectedRoute role="admin"><AdminFeedbacks /></ProtectedRoute>} />

                    {/* User routes */}
                    <Route path="/user" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
                    <Route path="/user/pay" element={<ProtectedRoute role="user"><MakePayment /></ProtectedRoute>} />
                    <Route path="/user/history" element={<ProtectedRoute role="user"><PaymentHistory /></ProtectedRoute>} />
                    <Route path="/user/feedback" element={<ProtectedRoute role="user"><SubmitFeedback /></ProtectedRoute>} />
                    <Route path="/user/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
