import { Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";
import { useContext, useState } from "react";
import AuthenticationModal from "../components/AuthenticationModal";

const Root = () => {
    const {showModal} = useContext(AuthContext);
    const [search, setSearch] = useState("");
    
    return (
        <div className="container mx-auto font-inter">
            <Navbar search={search} setSearch={setSearch} />

            {
                showModal && <AuthenticationModal />
            }

            <Outlet context={search} />
        </div>
    );
};

export default Root;