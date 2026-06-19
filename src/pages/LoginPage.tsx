import LoginForm from '../components/auth/LoginForm';
import useAuthStore from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <LoginForm />;
};

export default LoginPage;