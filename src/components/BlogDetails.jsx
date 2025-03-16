import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase.config";
import MDEditor from "@uiw/react-md-editor";

const BlogDetails = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const getBlog = async () => {
            const blogRef = doc(db, "blogs", blogId);
            const blogSnap = await getDoc(blogRef);

            if (blogSnap.exists()) {
                setBlog(blogSnap.data());
            }
        }
        getBlog();
    }, [blogId]);

    if (blog === null) return <p>Loading...</p>;

    const { title, description, author, likes, comments, banner_image, date } = blog;
    
    const realDate = date.toDate();
    const formattedDate = realDate.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    })
        
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-sm text-gray-600">by {author.name} | {formattedDate}</p>
            </div>

            <div className="mb-6">
                <img src={banner_image} alt={title} className="w-full h-[300px] object-cover rounded-lg" />
            </div>

            <div className="max-w-none mb-6" data-color-mode="light">
                {/* Rendering the description as Markdown */}
                <MDEditor.Markdown source={description} />
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-[#242424] flex items-center gap-4">
                    <span className="flex items-center gap-1" title={`${likes} Upvotes`}>
                        <i className="bi bi-arrow-up-circle"></i> {likes}
                    </span>
                    <span className="flex items-center gap-1" title={`${comments} Comments`}>
                        <i className="bi bi-chat-left-text"></i> {comments}
                    </span>
                </div>

                <div>
                    <i className="bi bi-bookmark-fill cursor-pointer" size={24}></i>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;