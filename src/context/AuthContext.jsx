import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const apiURL = process.env.REACT_APP_API_URL || 'http://vurudi100.pythonanywhere.com';

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        return storedTokens ? JSON.parse(storedTokens) : null;
    });
    const [user, setUser] = useState(() => (authTokens ? jwt_decode(authTokens.access) : null));
    const [loading, setLoading] = useState(true);

    const navigateTo = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiURL}/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAuthTokens(data);
                setUser(jwt_decode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigateTo('/');
            } else {
                console.error(response);
                alert('Something went wrong!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong!');
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    const updateToken = async () => {
        try {
            const response = await fetch(`${apiURL}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: authTokens?.refresh }),
            });

            if (response.ok) {
                const data = await response.json();
                setAuthTokens(data);
                setUser(jwt_decode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error('Error:', error);
            logoutUser();
        }

        if (loading) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        const tokenExpirationTime = jwt_decode(authTokens?.access)?.exp * 1000 || 0;
        const refreshInterval = tokenExpirationTime - Date.now() - 300000; // Refresh 5 minutes before expiration

        const interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
