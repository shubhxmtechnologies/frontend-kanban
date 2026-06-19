import RegisterForm from '../components/auth/RegisterForm';
import useAuthStore from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <RegisterForm />;
};

export default RegisterPage;