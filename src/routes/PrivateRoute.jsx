import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, setShowModal, loading } = useContext(AuthContext);
    if (loading) {
        return;
    }
    if (!user) {
        setShowModal(true);
        return <Navigate to="/" />
    }

    return children;
};

export default PrivateRoute;