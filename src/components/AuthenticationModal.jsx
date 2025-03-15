import { IoCloseOutline } from "react-icons/io5";
import googleIcon from "../assets/images/google-icon.webp"
import { CiMail } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { LuEyeClosed } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { AuthContext } from "../providers/AuthProvider";

const AuthenticationModal = ({ modalContent, setModalContent, setShowModal }) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {signInWithGoogle, createUser} = useContext(AuthContext);

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
        })
        .catch(error => console.log(error.message))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

        // getting form values
        const name = formData.name;
        const email = formData.email;
        const password = formData.password;

        if(name.length < 4) {
            setErrorMessage("Name should at least contain 4 characters.");
            return;
        }
        if(!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email.");
            return;
        }
        if(!passwordRegex.test(password)) {
            setErrorMessage("Password must be at least 6 characters long, and include uppercase, lowercase, and a number.");
            return;
        }

        // creating a user with email and password
        createUser(email, password)
        .then(res => console.log(res.user))
        .catch(err => console.log(err.message))


        // resetting form values
        setFormData({name: "", email: "", password: ""});
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
                                {/* Heading */}
                                < h2 className="text-center text-[28px] leading-8 mt-2">Welcome Back</h2>

                                {/* Sign in buttons */}
                                <div className="mt-12 w-[300px] space-y-3">
                                    <button onClick={handleSignInGoogle} className="flex items-center justify-between w-full border p-2 rounded-full cursor-pointer">
                                        <img className="w-6" src={googleIcon} alt="Google Icon" />
                                        <span>Sign in with Google</span>
                                        <div className="w-6"></div> {/* An empty div to balance the layout */}
                                    </button>

                                    <button className="flex items-center justify-between w-full border p-2 rounded-full cursor-pointer">
                                        <CiMail size={25} />
                                        <span>Sign in with email</span>
                                        <div className="w-6"></div> {/* An empty div to balance the layout */}
                                    </button>
                                </div>

                                <p className="text-[16px] leading-6 mt-11">No account? <button onClick={() => setModalContent("signup")} className="text-[#1A8917] font-bold cursor-pointer">Create One</button></p>
                            </div>
                        )
                        :
                        (
                            <div className="flex flex-col items-center">
                                {/* Heading */}
                                < h2 className="text-center text-[28px] leading-8 mt-2">Join Writeup</h2>

                                {/* Sign up form */}
                                <form onSubmit={handleSubmit} className="mt-6 w-[350px] space-y-4">
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