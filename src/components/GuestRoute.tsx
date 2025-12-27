import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

function GuestRoute() {
    const { user, isInitialized } = useAuth();

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard/blog" replace />;
    }

    return (
        <Outlet />
    )
}

export default GuestRoute