import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute() {
    const { user, isInitialized } = useAuth();
    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute