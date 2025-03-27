import { Link } from "react-router-dom";
const UserBlog = ({ blog }) => {
    const { title, description, id, date } = blog;
    const formattedDate = date?.toDate ? date.toDate().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    }) : "Unknown";


    return (
        <li className="border p-4 mb-3 rounded-lg shadow transform transition-transform hover:scale-[1.01]">
            <Link to={`/blogs/${id}`}>
                <h3 className="text-xl font-semibold mb-1 text-[#242424]">{title}</h3>
                <p className="text-gray-600 mb-1">{description.slice(0, 100)}...</p>

                <p className="text-[15px] text-gray-600 font-semibold">Published on {formattedDate}</p>
            </Link>
        </li>
    );
};

export default UserBlog;