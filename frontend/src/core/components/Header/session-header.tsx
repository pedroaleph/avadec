import { getSessionData, logout } from 'core/utils/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from '../ModalConfirm';

const SessionHeader = () => {
    const navigate = useNavigate();
    const { email, name } = getSessionData();

    const [showModal, setShowModal] = useState(false);

    const onCloseModal = () => setShowModal(false);
    const onShowModal = () => setShowModal(true);

    const onLogout = () => {
        logout();
        navigate('/auth/login');
        onCloseModal();
    };
    return (
        <div className="d-flex align-items-center">
            <ModalConfirm
                message="Deseja realmente sair?"
                show={showModal}
                onConfirm={onLogout}
                onClose={onCloseModal}
            />
            <div className="w-25"></div>
            <code className="header-session">
                {name} <br /> {email}
            </code>
            <button
                type="button"
                className="btn btn-outline-primary text-uppercase w-25"
                onClick={onShowModal}
            >
                sair
            </button>
        </div>
    );
};

export default SessionHeader;
