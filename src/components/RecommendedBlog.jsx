import { Link } from "react-router-dom";

const RecommendedBlog = ({ blog }) => {
    const { title, date, author, id } = blog;

    const formattedDate = date?.toDate ? date.toDate().toLocaleDateString("en-US", {
        day: "numeric", month: "long"
    }) : "Unknown Date";
    return (
        <div className="flex flex-col gap-2 border-b border-gray-300 pb-3">
            <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Author:</span> {author?.name || "Unknown"}
            </p>
            <Link
                to={`/blogs/${id}`}
                className="flex flex-col gap-1 hover:text-green-600"
            >
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{title}</h3>
                <span className="text-gray-500 text-sm">{formattedDate}</span>
            </Link>
        </div>
    );
};

export default RecommendedBlog;