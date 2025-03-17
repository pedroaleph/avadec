import request from 'core/utils/request';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        senha: '',
    });
    const [isInvalid, setIsInvalid] = useState(false);

    const navigate = useNavigate();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        request
            .post('/logar', credentials)
            .then((res) => {

                localStorage.setItem('token', res.data.token);
                const stationId = localStorage.getItem('selected-station-id');
                const path = '/stations' + (stationId ? '/' + stationId : '');

                navigate(path);
            })
            .catch((error) => {
                setIsInvalid(true);
            });
    };

    return (
        <form className="mx-3 my-3" onSubmit={onSubmit}>
            {isInvalid && (
                <div className="alert alert-danger" role="alert">
                    Email ou senha incorretos
                </div>
            )}
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Digite seu e-mail"
                    value={credentials.email}
                    onChange={(event) =>
                        setCredentials({
                            ...credentials,
                            email: event.target.value,
                        })
                    }
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Senha
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Digite sua senha"
                    value={credentials.senha}
                    onChange={(e) =>
                        setCredentials({
                            ...credentials,
                            senha: e.target.value,
                        })
                    }
                />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
                Entrar
            </button>
        </form>
    );
};

export default Login;
