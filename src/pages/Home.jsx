import React, { useCallback, useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import Blog from "../components/Blog";
import { collection, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = useCallback(async () => {
        try {
            const blogsCollection = collection(db, "blogs");
            const snapshot = await getDocs(blogsCollection);

            const blogsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBlogs(blogsList);
            setLoading(false);
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return (
        <div>
            {loading ? (
                <div className="text-center mt-12">Loading blogs...</div>
            ) : blogs.length === 0 ? (
                <div className="text-center mt-12">No blogs available.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 mt-12 px-5 gap-6">
                    {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Home;
