import { useEffect, useState } from "react";
import {db} from "../firebase/firebase.config"
import Blog from "../components/Blog";
import { collection, getDocs } from "firebase/firestore";

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
                <div>
                    {
                        blogs.map(blog => <Blog key={blog.id} blog={blog} />)
                    }
                </div>
        </div>
    );
};

export default Home;