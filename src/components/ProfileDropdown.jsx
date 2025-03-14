import { useContext, useEffect, useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { AuthContext } from "../providers/AuthProvider";
import { NavLink } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { PiBookmarksSimpleThin } from "react-icons/pi";

const ProfileDropdown = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // closing dropdown if user clicks outside
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.addEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="relative">
            {/* Profile Icon */}
            <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                <RxAvatar size={33} />
                {user && user.displayName}
            </button>

            {/* Dropdown menu */}
            {
                isOpen && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 py-[25px] px-[25px]">
                        <ul className="flex flex-col gap-[18px] text-[#6B6B6B] text-[15px]">
                            <li className="hover:text-black"><NavLink className="flex items-center gap-3"><LuUser size={27} />Profile</NavLink></li>
                            <li className="hover:text-black"><NavLink className="flex items-center gap-3"><BsReverseLayoutTextSidebarReverse size={20} />Your Blogs</NavLink></li>
                            <li className="hover:text-black"><NavLink className="flex items-center gap-3" ><PiBookmarksSimpleThin size={26} />Bookmarks</NavLink></li>

                            {user ?
                                <button className="border text-[16px] cursor-pointer py-1 font-semibold hover:bg-[#6b6b6b76] transition">Log Out</button>
                                :
                                <button className="border text-[16px] cursor-pointer py-1 font-semibold hover:bg-[#6b6b6b76] transition">Sign in</button>
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    );
};

export default ProfileDropdown;