import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import auth from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("signin");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => unsubscribe();
    }, []);

    // memorized functions to optimize performance
    const signInWithGoogle = useCallback(() => {
        return signInWithPopup(auth, googleProvider);
    }, []);

    const createUser = useCallback((email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }, []);

    const signInUser = useCallback((email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }, []);

    const signOutUser = useCallback(() => {
        return signOut(auth);
    }, []);

    const authInfo = useMemo(() => ({
        user,
        loading,
        signInWithGoogle,
        createUser,
        signInUser,
        signOutUser,
        showModal,
        setShowModal,
        modalContent,
        setModalContent
    }), [
        user,
        loading,
        signInWithGoogle,
        createUser,
        signInUser,
        signOutUser,
        showModal,
        setShowModal,
        modalContent,
        setModalContent
    ])
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;