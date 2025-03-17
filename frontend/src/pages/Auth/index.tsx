import './styles.scss';
import Header from 'core/components/Header';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import { useEffect } from 'react';
import { logout } from 'core/utils/auth';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const title = { name: location.pathname.split('/').at(-1) ?? '' };

    useEffect(() => {
        logout();
        location.pathname === '/auth' && navigate('/auth/login');
    }, [navigate, location]);

    return (
        <div className="auth-container col-12 col-sm-8 col-md-6">
            <Header title={title} showLogos={true} />
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
};

export default Auth;
