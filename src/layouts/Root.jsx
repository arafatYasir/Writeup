import { Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import AuthenticationModal from "../components/AuthenticationModal";

const Root = () => {
    const {showModal} = useContext(AuthContext);
    
    return (
        <div className="container mx-auto font-inter">
            <Navbar />

            {
                showModal && <AuthenticationModal />
            }

            <Outlet />
        </div>
    );
};

export default Root;