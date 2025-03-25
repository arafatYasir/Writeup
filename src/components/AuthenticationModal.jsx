import { IoCloseOutline, IoEyeOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { LuEyeClosed } from "react-icons/lu";
import { MdKeyboardArrowLeft } from "react-icons/md";
import googleIcon from "../assets/images/google-icon.webp"
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";

const AuthenticationModal = () => {
    const { modalContent, setModalContent, setShowModal } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [emailLogin, setEmailLogin] = useState(false);
    const { signInWithGoogle, createUser, signInUser } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (
            {
                ...prev,
                [name]: value
            }
        ));
    }

    const handleSignInGoogle = () => {
        signInWithGoogle()
            .then(res => {
                setShowModal(false);
                console.log(res.user)
            })
            .catch(error => console.log(error.message))
    }

    const handleCreateUser = (e) => {
        e.preventDefault();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

        // getting form values
        const name = formData.name;
        const email = formData.email;
        const password = formData.password;

        if (name.length < 4) {
            setErrorMessage("Name should at least contain 4 characters.");
            return;
        }
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email.");
            return;
        }
        if (!passwordRegex.test(password)) {
            setErrorMessage("Password must be at least 6 characters long, and include uppercase, lowercase, and a number.");
            return;
        }

        // creating a user with email and password
        createUser(email, password)
            .then(() => {
                // resetting form values
                setFormData({ name: "", email: "", password: "" });
                // updating user's profle instantly
                updateProfile(auth.currentUser, {
                    displayName: name
                })
                    .then(() => {
                        setShowModal(false);
                        console.log("Profile Updated");

                    })
                    .catch(err => console.log(err.message))
            })
            .catch(err => console.log(err.message))
    }

    const handleLoginUser = (e) => {
        e.preventDefault();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // getting form values
        const email = formData.email;
        const password = formData.password;

        if(!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email.");
            return;
        }

        // sign in the user with email and password
        signInUser(email, password)
        .then(() => setShowModal(false))
        .catch(error => console.log(error.message));
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Modal Content */}
            <div className="bg-white w-[400px] md:w-[500px] py-[44px] px-[56px] shadow-xl relative rounded-md">
                {/* Close button */}
                <button onClick={() => setShowModal(false)} className="absolute top-5 right-4 text-[#6B6B6B] hover:text-black cursor-pointer">
                    <IoCloseOutline size={25} />
                </button>

                {
                    modalContent === "signin" ?
                        (
                            <div className="flex flex-col items-center">
                                {
                                    emailLogin ?
                                        (
                                            <>
                                                {/* Heading */}
                                                <h2 className="text-center text-[28px] leading-8 mt-2">Sign in with email</h2>

                                                <form onSubmit={handleLoginUser} className="mt-8 w-[350px] space-y-4">
                                                    <div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="Email Address"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full border rounded-md p-3 focus:outline-none"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type={`${showPassword ? "text" : "password"}`}
                                                            name="password"
                                                            placeholder="Password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            className="w-full border rounded-md p-3 focus:outline-none"
                                                            required
                                                        />
                                                        <button className="cursor-pointer" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                            {
                                                                showPassword ?
                                                                    <LuEyeClosed className="absolute top-[50%] right-2 translate-y-[-50%]" size={18} />
                                                                    :
                                                                    <IoEyeOutline className="absolute top-[50%] right-2 translate-y-[-50%]" size={19} />
                                                            }
                                                        </button>
                                                    </div>
                                                    <p className="text-red-500">{errorMessage}</p>
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition duration-300"
                                                    >
                                                        Sign In
                                                    </button>
                                                </form>


                                                <button onClick={() => setEmailLogin(false)} className="flex items-center text-[#1A8917] cursor-pointer mt-10"><MdKeyboardArrowLeft size={20} />All sign in options</button>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                {/* Heading */}
                                                <h2 className="text-center text-[28px] leading-8 mt-2">Welcome Back</h2>

                                                {/* Sign in buttons */}
                                                <div className="mt-12 w-[300px] space-y-3">
                                                    <button onClick={handleSignInGoogle} className="flex items-center justify-between w-full border p-2 rounded-full cursor-pointer">
                                                        <img className="w-6" src={googleIcon} alt="Google Icon" />
                                                        <span>Sign in with Google</span>
                                                        <div className="w-6"></div> {/* An empty div to balance the layout */}
                                                    </button>

                                                    <button onClick={() => setEmailLogin(true)} className="flex items-center justify-between w-full border p-2 rounded-full cursor-pointer">
                                                        <CiMail size={25} />
                                                        <span>Sign in with email</span>
                                                        <div className="w-6"></div> {/* An empty div to balance the layout */}
                                                    </button>
                                                </div>

                                                <p className="text-[16px] leading-6 mt-11">No account? <button onClick={() => setModalContent("signup")} className="text-[#1A8917] font-bold cursor-pointer">Create One</button></p>
                                            </>
                                        )
                                }
                            </div>
                        )
                        :
                        (
                            <div className="flex flex-col items-center">
                                {/* Heading */}
                                < h2 className="text-center text-[28px] leading-8 mt-2">Join Writeup</h2>

                                {/* Sign up form */}
                                <form onSubmit={handleCreateUser} className="mt-6 w-[350px] space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-3 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-3 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={`${showPassword ? "text" : "password"}`}
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-3 focus:outline-none"
                                            required
                                        />
                                        <button className="cursor-pointer" type="button" onClick={() => setShowPassword(!showPassword)}>
                                            {
                                                showPassword ?
                                                    <LuEyeClosed className="absolute top-[50%] right-2 translate-y-[-50%]" size={18} />
                                                    :
                                                    <IoEyeOutline className="absolute top-[50%] right-2 translate-y-[-50%]" size={19} />
                                            }
                                        </button>
                                    </div>
                                    <p className="text-red-500">{errorMessage}</p>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition duration-300"
                                    >
                                        Sign Up
                                    </button>
                                </form>

                                <p className="text-[16px] leading-6 mt-11">Already have an account? <button onClick={() => setModalContent("signin")} className="text-[#1A8917] font-bold cursor-pointer">Sign in</button></p>
                            </div>
                        )

                }
            </div>
        </div >
    );
};

export default AuthenticationModal;