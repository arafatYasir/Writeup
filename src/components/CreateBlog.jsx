import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { EmailAuthCredential } from "firebase/auth/web-extension";
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

        // getting all form values
        const {title, imageUrl, description} = blogData;

        // checking if all values are prvided
        if (!title || !imageUrl || !description) {
            toast.error("All fields are required.");
            return;
        }

        setLoading(true);

        // add the blog to the firestore
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
            // showing a success toast
            toast.success("Blog added successfully!");

            // resetting the form
            setBlogData({title: "", description: "", imageUrl: ""});

            // navigating to the blog
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
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">Create a New Blog</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="title" className="block mb-1 text-gray-700">Title</label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:outline-none"
                        id="title"
                        name="title"
                        value={blogData.title}
                        onChange={handleChange}
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="imageUrl" className="block mb-1 text-gray-700">Banner Image URL</label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:outline-none"
                        id="imageUrl"
                        name="imageUrl"
                        value={blogData.imageUrl}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block mb-1 text-gray-700">Description (Markdown Supported)</label>
                    <textarea
                        rows="8"
                        className="w-full p-3 border rounded-lg focus:outline-none"
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
                    className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Blog"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default CreateBlog;