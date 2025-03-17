import jwtDecode from "jwt-decode";

export interface Session {
    email: string;
    name: string;
    isAdmin: boolean;
    iat: number;
    exp: number;
}

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    const { exp }: Session = jwtDecode(token);

    const isValid =  Date.now() <= exp * 1000;

    !isValid && logout();

    return isValid;
};

export const getSessionData = () => {
    const token = localStorage.getItem('token') as string;

    return jwtDecode(token) as Session;
}

export const logout = () => {
    localStorage.removeItem('token');
}