import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase.config";
import MDEditor from "@uiw/react-md-editor";
import { AuthContext } from "../providers/AuthProvider";
import { toast, ToastContainer } from "react-toastify";

import { BiUpvote } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";
import Comment from "./Comment";

const BlogDetails = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [comment, setComment] = useState("");
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);

    // loading specific blogs details
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

    // loading all comments of each blog
    useEffect(() => {
        const commentsRef = collection(db, "blogs", blogId, "comments");
        const unsubscribe = onSnapshot(commentsRef, snapshot => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [blogId]);

    // comment adding function
    const handleAddComment = async (e) => {
        e.preventDefault();

        // checking if user is logged in
        if (!user) {
            toast.error("Please login to add comment.");
            return;
        }
        // checking if the comment box is not empty
        if (!comment.trim()) {
            toast.error("Dont left the comment empty.");
            return;
        }
        setLoading(true);
        try {
            const commentRef = collection(db, "blogs", blogId, "comments");
            await addDoc(commentRef, {
                name: user.displayName,
                email: user.email,
                comment: comment.trim(),
                date: serverTimestamp()
            });
            toast.success("Comment added!");
            setComment("");
            setLoading(false);
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    if (blog === null) return <p>Loading...</p>;

    const { title, description, author, likes, comments_count, banner_image, date } = blog;

    // formatting the timestamp to a real date
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
                        <BiUpvote size={25} /> {likes}
                    </span>
                    <span className="flex items-center gap-1" title={`${comments.length} Comments`}>
                        <LiaCommentSolid size={25} /> {comments.length}
                    </span>
                </div>

                <div>
                    <i className="bi bi-bookmark-fill cursor-pointer" size={24}></i>
                </div>
            </div>


            {/* Comment Section */}
            <div className="mt-10 p-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Leave a Comment</h3>
                <form onSubmit={handleAddComment} className="flex flex-col gap-3">
                    <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment..."
                        className="border rounded-md p-2 w-full"
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        {
                            loading ? "Adding..." : "Add Comment"
                        }
                    </button>
                </form>
            </div>

            <div className="mt-6 p-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <div>
                    {comments.length === 0 ? (
                        <p>No comments yet. Be the first to comment!</p>
                    ) : (
                        comments.map(comment => <Comment key={comment.id} comment={comment} />))
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BlogDetails;