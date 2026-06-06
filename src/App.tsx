import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Login, Register, ForgotPassword } from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Trading } from './pages/Trading';
import { Security } from './pages/Security';
import { Deposit, Withdraw } from './pages/Transactions';
import { History } from './pages/History';
import { AdminDashboard } from './pages/AdminDashboard';
import { Maintenance } from './pages/Maintenance';
import { Landing } from './pages/Landing';
import { PrivateRoute, AppLayout } from './components/Navigation';


import { Notifications } from './pages/Notifications';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Analytics />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/maintenance" element={<Maintenance />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/history" element={<History />} />
                <Route path="/security" element={<Security />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
