import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/shared/ProtectedRoute';
import useAuthStore from './store/useAuthStore';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import DashboardLayout from './components/shared/DashboardLayout';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import TaskPage from './pages/TaskPage';

function App() {
    const { isAuthenticated } = useAuthStore()
    return (
        <Router>
            {/* Toast notifications with design-system styling */}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#171717',
                        backgroundColor: '#ffffff',
                        border: '1px solid #ebebeb',
                        borderRadius: '8px',
                        boxShadow: '0px 1px 1px rgba(0,0,0,0.03), 0px 8px 16px -4px rgba(0,0,0,0.06)',
                        padding: '12px 16px',
                    },
                    success: {
                        iconTheme: { primary: '#00dfd8', secondary: '#ffffff' },
                        duration: 3000,
                    },
                    error: {
                        iconTheme: { primary: '#ee0000', secondary: '#ffffff' },
                        duration: 4000,
                    },
                }}
            />

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes wrapped in DashboardLayout */}
                <Route element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>}>
                    <Route path="/dashboard" element={<DashboardOverviewPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/my-boards" element={<DashboardPage />} />
                    <Route path="/board/:id" element={<BoardPage />} />
                    <Route path="/task/:id" element={<TaskPage />} />
                </Route>

                {/* root redirect */}
                <Route
                    path="/"
                    element={
                        isAuthenticated
                        && <Navigate to="/dashboard" replace />
                    }
                />
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes >
        </Router >
    );
}

export default App;
