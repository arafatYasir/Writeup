import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import UserBlog from "../components/UserBlog";
import { Link } from "react-router-dom";
import RecommendedBlog from "../components/RecommendedBlog";

const UserBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [recommendedBlogs, setRecommendedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const loadUserBlogs = useCallback(async () => {
        if (!user?.email) return; // Prevents error if user is null

        try {
            setLoading(true);
            // Fetch user's blogs
            const q = query(collection(db, "blogs"), where("author.email", "==", user.email));
            const querySnapshot = await getDocs(q);
            const userBlogs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Fetch recommended blogs
            const recommendedQ = query(collection(db, "blogs"));
            const recommendedSnapshot = await getDocs(recommendedQ);
            const recommended = recommendedSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setBlogs(userBlogs);
            setRecommendedBlogs(recommended);
        } catch (error) {
            console.error("Error loading blogs:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        loadUserBlogs();
    }, [loadUserBlogs]);

    return (
        <div className="px-5 flex flex-col md:flex-row md:gap-16 max-w-6xl mx-auto mt-8">
            {/* User Blogs Section */}
            <div className="md:w-3/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-semibold text-[#242424]">Your Blogs</h2>
                    <Link
                        to="/create-blog"
                        className="bg-[#1A8917] px-5 py-2 rounded-full text-white font-medium shadow-md 
                                   hover:bg-green-700 transition duration-300"
                    >
                        Write a Blog
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-3 border-[#1A8917] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">No blogs found.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {blogs.map(blog => (
                            <UserBlog key={blog.id} blog={blog} />
                        ))}
                    </ul>
                )}
            </div>

            {/* Recommended Blogs Section */}
            <div className="md:w-2/5 border-l border-gray-200 pl-6">
                <h4 className="font-semibold text-lg text-[#242424]">Recommended Blogs</h4>

                {loading ? (
                    <div className="flex justify-center items-center py-6">
                        <div className="w-6 h-6 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : recommendedBlogs.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm mt-4">No recommended blogs.</p>
                ) : (
                    <div className="flex flex-col gap-6 mt-6">
                        {recommendedBlogs.map(blog => (
                            <RecommendedBlog key={blog.id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBlogs;