import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles}) => {
    const {auth} = useAuth();
    const location = useLocation();

    return(
        auth?.username
            ?<Outlet />
            : <Navigate to="/Login"/>
    );
}

export default RequireAuth;