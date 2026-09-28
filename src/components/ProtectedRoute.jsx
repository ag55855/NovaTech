import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AdminLayout from "./AdminLayout";

function ProtectedRoute({ children }) {

    const {
        admin,
        loading
    } = useAuth();

    if (loading) {

        return (
            <div className="page-loader">
                <div className="loader"></div>
            </div>
        );

    }

    if (!admin) {

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }

    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}

export default ProtectedRoute;