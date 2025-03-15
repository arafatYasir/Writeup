import { Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";
import { useState } from "react";
import AuthenticationModal from "../components/AuthenticationModal";

const Root = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("signin");
    return (
        <div className="container mx-auto font-inter">
            <Navbar showModal={showModal} setShowModal={setShowModal} />

            {
                showModal && <AuthenticationModal modalContent={modalContent} setModalContent={setModalContent} setShowModal={setShowModal} />
            }

            <Outlet />
        </div>
    );
};

export default Root;