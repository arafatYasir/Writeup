import { useEffect, useState } from "react";
import {db} from "../firebase/firebase.config"
import Blog from "../components/Blog";
import { collection, getDocs } from "firebase/firestore";
import { ToastContainer } from "react-toastify";

const Home = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const blogsCollection = collection(db, "blogs");
                const snapshot = await getDocs(blogsCollection);

                const blogsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setBlogs(blogsList);
            }
            catch (error) {
                console.log("Error fetching blogs");
            }
        }

        fetchBlogs();
    }, []);
    return (
        <div>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-12 px-5 gap-6">
                    {
                        blogs.map(blog => <Blog key={blog.id} blog={blog} />)
                    }
                </div>

                <ToastContainer />
        </div>
    );
};

export default Home;