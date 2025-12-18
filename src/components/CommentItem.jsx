import { useState } from "react";
import { useAuth } from "@/auth/useAuth";

export default function CommentItem({
  comment,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment?.content || "");

  if (!comment) return null;

  // Check if current user can edit/delete this comment
  const isCommentOwner = user && comment.author?.username === user.username;
  const isAdmin = user?.role === "ADMIN";
  const canModify = isCommentOwner || isAdmin;

  const authorName = comment.author
    ? `${comment.author.firstName} ${comment.author.lastName}`
    : "Anonymous";

  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString()
    : null;

  const handleSave = () => {
    if (!newContent.trim()) return; // don't allow empty comment
    onEdit({ ...comment, content: newContent });
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-gray-800">{authorName}</p>
        {formattedDate && (
          <span className="text-sm text-gray-500">{formattedDate}</span>
        )}
      </div>

      {isEditing ? (
        <div className="mb-3">
          <textarea
            className="w-full border rounded p-2 text-gray-700"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
          />
        </div>
      ) : (
        <p className="text-gray-700 mb-3">{comment.content}</p>
      )}

      {canModify && (
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-sm bg-[#1a1a2e] text-white rounded-full hover:bg-[#2d2d44] transition font-medium"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewContent(comment.content);
                }}
                className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {isCommentOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 text-sm bg-[#1a1a2e] text-white rounded-full hover:bg-[#2d2d44] transition font-medium"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => onDelete(comment)}
                className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// export default function CommentItem({ comment, onEdit, onDelete }) {
//   if (!comment) return null;

//   const authorName = comment.author
//     ? `${comment.author.firstName} ${comment.author.lastName}`
//     : "Anonymous";

//   const formattedDate = comment.createdAt
//     ? new Date(comment.createdAt).toLocaleString()
//     : null;

//   return (
//     <div className="border border-gray-300 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
//       <div className="flex justify-between items-center mb-2">
//         <p className="font-semibold text-gray-800">{authorName}</p>
//         {formattedDate && (
//           <span className="text-sm text-gray-500">{formattedDate}</span>
//         )}
//       </div>

//       <p className="text-gray-700 mb-3">{comment.content}</p>

//       {/* Action buttons */}
//       <div className="flex gap-2">
//         <button
//           onClick={() => onEdit(comment)}
//           className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//         >
//           Edit
//         </button>
//         <button
//           onClick={() => onDelete(comment)}
//           className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function CommentItem({ comment }) {
//   if (!comment) return null;

//   const authorName = comment.author
//     ? `${comment.author.firstName} ${comment.author.lastName}`
//     : "Anonymous";

//   // optional: format timestamp if available
//   const formattedDate = comment.createdAt
//     ? new Date(comment.createdAt).toLocaleString()
//     : null;

//   return (
//     <div className="border border-gray-300 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
//       <div className="flex justify-between items-center mb-2">
//         <p className="font-semibold text-gray-800">{authorName}</p>
//         {formattedDate && (
//           <span className="text-sm text-gray-500">{formattedDate}</span>
//         )}
//       </div>
//       <p className="text-gray-700">{comment.content}</p>
//     </div>
//   );
// }
