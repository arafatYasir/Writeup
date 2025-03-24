import { addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
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
    const [isUpvoting, setIsUpvoting] = useState(false);

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
            const blogRef = doc(db, "blogs", blogId);

            // updating inside the state
            setBlog(prev => ({
                ...prev,
                comments_count: prev.comments_count + 1
            }));

            // updating the comment count in firestore
            await updateDoc(blogRef, {
                comments_count: blog.comments_count + 1
            });

            // adding the comment in firestore
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

    // adding upvote for a blog
    const handleUpvote = async () => {
        if (!user) {
            toast.error("Please login to upvote.");
            return;
        }

        // getting the blog ref
        const blogRef = doc(db, "blogs", blogId);

        setIsUpvoting(true);
        try {
            // if the user already had upvoted and now clicking again
            if (blog.upvotedBy?.includes(user?.email)) {
                // decreasing the like and updating the state
                setBlog(prev => ({
                    ...prev,
                    likes: prev.likes - 1,
                    upvotedBy: prev.upvotedBy.filter(email => email !== user.email)
                }));

                // updating in firestore
                await updateDoc(blogRef, {
                    likes: blog.likes - 1,
                    upvotedBy: blog.upvotedBy.filter(email => email !== user.email)
                });

            }
            // if the user is clicking for the first time
            else {
                // increasing upvote inside the state
                setBlog(prev => ({
                    ...prev,
                    likes: prev.likes + 1,
                    upvotedBy: [...(prev.upvotedBy || []), user.email]
                }));

                // updating in firestore
                await updateDoc(blogRef, {
                    likes: blog.likes + 1,
                    upvotedBy: arrayUnion(user.email)
                });

                toast.success("Upvoted!");
            }

        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsUpvoting(false);
        }
    }

    if (blog === null) return <p>Loading...</p>;

    const { title, description, author, comments_count, upvotedBy, banner_image, date } = blog;

    // formatting the timestamp to a real date
    const formattedDate = date?.toDate ? date.toDate().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    }) : "Unknown Date";

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="text-center mb-6">
                <h1 className="text-[42px] font-bold mt-14 text-[#242424]">{title}</h1>
                <p className="text-[15px] text-gray-600 mt-1">by <span className="font-semibold">{author.name}</span> | <span className="font-semibold">{formattedDate}</span></p>
            </div>

            <div className="mb-6">
                <img src={banner_image} alt={title} className="w-full h-auto object-cover rounded-lg" />
            </div>

            <div className="max-w-none mb-6 markdown">
                {/* Rendering the description as Markdown */}
                <MDEditor.Markdown source={description} />
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-[#242424] flex items-center gap-4">
                    <span
                        className={`flex items-center gap-1 cursor-pointer ${blog?.upvotedBy?.includes(user?.email) ? "text-blue-600" : ""
                            }`}
                        onClick={handleUpvote}
                        title={`${upvotedBy?.length} Upvotes`}
                    >
                        <BiUpvote size={25} /> {upvotedBy ? upvotedBy.length : 0}
                    </span>
                    <span className="flex items-center gap-1" title={`${comments_count} Comments`}>
                        <LiaCommentSolid size={25} /> {comments_count}
                    </span>
                </div>

                <div>
                    <i className="bi bi-bookmark-fill cursor-pointer" size={24}></i>
                </div>
            </div>

            {/* Comment adding section */}
            <div className="mt-10 p-6 bg-white rounded-xl shadow-md border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave a Comment</h3>
                <form onSubmit={handleAddComment} className="flex flex-col gap-4">
                    <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment..."
                        className="border border-gray-300 rounded-lg p-4 w-full text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ease-in-out duration-200"
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {loading ? "Adding..." : "Add Comment"}
                    </button>
                </form>
            </div>
            
            {/* Showing all the comments */}
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