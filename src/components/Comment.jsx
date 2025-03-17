const Comment = ({ comment }) => {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.name}</span>
                <span className="text-sm text-gray-500">
                    {comment.date ? comment.date.toDate().toLocaleDateString(): "Just Now"}
                </span>
            </div>
            <p>{comment.comment}</p>
        </div>
    );
};

export default Comment;