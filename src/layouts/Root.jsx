import { Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";

const Root = () => {
    return (
        <div className="container mx-auto font-inter">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Root;