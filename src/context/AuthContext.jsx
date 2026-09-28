import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/auth/me")
            .then((response) => {
                setAdmin(response.data);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setAdmin(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function login(email, password) {
        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        localStorage.setItem(
            "token",
            response.data.token
        );

        setAdmin(response.data.admin);

        return response.data;
    }

    function logout() {
        localStorage.removeItem("token");
        setAdmin(null);
    }

    return (
        <AuthContext.Provider
            value={{
                admin,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}