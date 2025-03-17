import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_URL ?? 'http://localhost:5000';

export const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
}

const request = axios.create({
    baseURL: BASE_URL
});

request.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;

        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default request;