import logo from "../assets/images/logo.webp"
import { AuthContext } from "../providers/AuthProvider";
import { Link, NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { SlNote } from "react-icons/sl";
import ProfileDropdown from "./ProfileDropdown";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";

const Navbar = () => {
    const {setShowModal} = useContext(AuthContext);
    return (
        <nav className="">
            <div className="flex items-center justify-between py-4 border-b border-b-[#e7e7e7]">
                <div className="flex items-center gap-5">
                    <div>
                        <Link to="/">
                            <img src={logo} alt="Writeup Logo" />
                        </Link>
                    </div>
                    <div className="relative">
                        <CiSearch className="absolute top-[50%] -translate-[50%] left-6" size={25} />
                        <input className="py-[10px] pl-[50px] pr-[20px] bg-[#F9F9F9] rounded-[20px] placeholder:text-sm" type="text" placeholder="Search" />
                    </div>
                </div>

                <ul className="flex items-center gap-7">
                    <li className="text-[#6B6B6B] text-[15px] hover:text-black "><Link to="create-blog" className="flex gap-2" ><SlNote size={21} />Write</Link></li>

                    <ProfileDropdown setShowModal={setShowModal} />
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;