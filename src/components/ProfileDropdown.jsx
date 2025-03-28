import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { AuthContext } from "../providers/AuthProvider";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { PiBookmarksSimpleThin } from "react-icons/pi";

const ProfileDropdown = ({ setShowModal }) => {
    const { user, signOutUser } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const handleClick = useCallback((e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    }, []);

    // closing dropdown if user clicks outside
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [handleClick]);

    return (
        <div className="relative">
            {/* Profile Icon */}
            <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer flex items-center gap-1 ${user && "md:bg-[#6b6b6b77] md:py-1 md:px-2 md:rounded-xl"}`}>

                <RxAvatar size={33} />
                <span className="hidden md:inline">{user && user.displayName}</span>
            </button>

            {/* Dropdown menu */}
            {
                isOpen && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 py-[25px] px-[25px] ">
                        <ul className="flex flex-col gap-[18px] text-[#6B6B6B] text-[15px]">
                            <li className="hover:text-black"><Link to="/profile" className="flex items-center gap-3"><LuUser size={27} />Profile</Link></li>
                            <li className="hover:text-black"><Link to="/your-blogs" className="flex items-center gap-3"><BsReverseLayoutTextSidebarReverse size={20} />Your Blogs</Link></li>
                            <li className="hover:text-black"><Link to="/bookmarks" className="flex items-center gap-3" ><PiBookmarksSimpleThin size={26} />Bookmarks</Link></li>

                            {user ?
                                <button onClick={() => { signOutUser(); setIsOpen(false) }} className="bg-[#191919] text-white text-[16px] cursor-pointer py-1 font-semibold hover:bg-black transition rounded-full">Sign out</button>
                                :
                                <button onClick={() => { setShowModal(true); setIsOpen(false) }} className="bg-[#191919] text-white text-[16px] cursor-pointer py-1 font-semibold hover:bg-black transition rounded-full">Sign in</button>
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    );
};

export default ProfileDropdown;