import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
    const [blogData, setBlogData] = useState({ title: "", imageUrl: "", description: "" });
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setBlogData(prev => (
            {
                ...prev,
                [name]: value
            }
        ));

        console.log(e.target);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {title, imageUrl, description} = blogData;

        if (!title || !imageUrl || !description) {
            toast.error("All fields are required.");
            return;
        }

        setLoading(true);

        try {
            const docRef = await addDoc(collection(db, "blogs"), {
                title,
                description,
                date: new Date(),
                author: {
                    email: user.email,
                    name: user.displayName
                },
                comments_count: 0,
                banner_image: imageUrl
            });

            toast.success("Blog added successfully!");
            setBlogData({title: "", description: "", imageUrl: ""});
            navigate(`/blogs/${docRef.id}`);
        }
        catch(error) {
            toast.error("Error adding the blog.");
            console.log(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Create a New Blog</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label htmlFor="title" className="block mb-2 text-lg text-gray-700">Title</label>
                    <input
                        type="text"
                        className="w-full p-4 border-b-2 border-gray-300 focus:outline-none focus:border-green-600 transition duration-300"
                        id="title"
                        name="title"
                        value={blogData.title}
                        onChange={handleChange}
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="imageUrl" className="block mb-2 text-lg text-gray-700">Banner Image URL</label>
                    <input
                        type="text"
                        className="w-full p-4 border-b-2 border-gray-300 focus:outline-none focus:border-green-600 transition duration-300"
                        id="imageUrl"
                        name="imageUrl"
                        value={blogData.imageUrl}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block mb-2 text-lg text-gray-700">Description (Markdown Supported)</label>
                    <textarea
                        rows="8"
                        className="w-full p-4 border-b-2 border-gray-300 focus:outline-none focus:border-green-600 transition duration-300 resize-none"
                        id="description"
                        name="description"
                        value={blogData.description}
                        onChange={handleChange}
                        placeholder="Write your blog content here..."
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 disabled:opacity-50 transition duration-300"
                >
                    {loading ? "Adding..." : "Add Blog"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default CreateBlog;