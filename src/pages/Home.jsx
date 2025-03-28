import React, { Suspense, useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import { useOutletContext } from "react-router-dom";

const Blog = React.lazy(() => import("../components/Blog"));

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchValue = useOutletContext();

    useEffect(() => {
        const blogsCollection = collection(db, "blogs");

        const unsubscribe = onSnapshot(blogsCollection, snapshot => {
            const blogs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBlogs(blogs);
            setLoading(false);
        })

        return () => unsubscribe();
    }, []);
    return (
        <div>
            {loading ? (
                <div className="text-center mt-12">Loading blogs...</div>
            ) : blogs.length === 0 ? (
                <div className="text-center mt-12">No blogs available.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 mt-12 px-5 gap-6">
                    <Suspense>
                        {blogs.filter(blog => (blog.description.includes(searchValue) || blog.title.includes(searchValue))).map((blog, idx) => <Blog key={idx} blog={blog} idx={idx} />)}
                    </Suspense>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Home;
