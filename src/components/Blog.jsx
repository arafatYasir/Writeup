import { Link } from "react-router-dom";
import { BiUpvote } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";
import { CiBookmark } from "react-icons/ci";

const Blog = ({ blog }) => {
    const { title, description, author, likes, comments_count, banner_image, date, id } = blog;
    const realDate = date.toDate();
    const formattedDate = realDate.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    })

    return (
        <div className="border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-200">
            {/* Banner */}
            <div className="mb-4">
                <img className="w-full h-48 object-cover rounded-xl" src={banner_image} alt="Banner" />
            </div>

            {/* Title & Description */}
            <Link to={`/blogs/${id}`}>
                <h2 className="text-xl font-bold leading-7 text-gray-900 hover:underline">{title}</h2>
                <p className="mt-2 text-gray-600 text-sm leading-6">
                    {description.slice(0, 150)}...
                </p>
            </Link>

            <p className="text-sm text-gray-500 mt-1.5">Published on: <span className="font-semibold">{formattedDate}</span></p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-5">
                {/* Left Section */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-700 text-sm">
                    <p>Author: <span className="font-semibold">{author.name}</span></p>

                    <div className="flex items-center gap-1" title={`${likes} Upvotes`}>
                        <BiUpvote size={18} />
                        <span>{likes}</span>
                    </div>

                    <div className="flex items-center gap-1" title={`${comments_count} Comments`}>
                        <LiaCommentSolid size={18} />
                        <span>{comments_count}</span>
                    </div>
                </div>

                {/* Bookmark Icon */}
                <CiBookmark className="cursor-pointer text-gray-700" size={22} />
            </div>
        </div>
    );
};

export default Blog;