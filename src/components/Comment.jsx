import React from "react";
import { RxAvatar } from "react-icons/rx";

const Comment = React.memo(({ comment }) => {
    return (
        <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm mb-6">
            <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center gap-1 font-semibold text-lg text-gray-800"><RxAvatar size={30} />{comment.name}</span>
                <span className="text-sm text-gray-500">
                    {comment.date ? comment.date.toDate().toLocaleDateString() : "Just Now"}
                </span>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">{comment.comment}</p>
        </div>
    );
});

export default Comment;