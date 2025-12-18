import { useState } from "react";
<<<<<<< HEAD
import { useAuth } from "../auth/useAuth";

export default function CommentItem({ comment, onEdit, onDelete }) {
  const { user } = useAuth();

  // Determine if the current user is the author
  const isAuthor = user && comment.authorUsername === user.username;

  // Determine if the current user is an admin
  const isAdmin = user?.role === "ADMIN" || user?.role?.toUpperCase() === "ADMIN";

  const canEdit = isAuthor;
  const canDelete = isAuthor || isAdmin; // Admins can delete any comment

=======
import { useAuth } from "@/auth/useAuth";

export default function CommentItem({
  comment,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const { user } = useAuth();
>>>>>>> 7eff28f493f45a0c5c320b26d050cfe2f0458879
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);

  if (!comment) return null;

<<<<<<< HEAD
  const displayName =
    comment.firstName && comment.lastName
      ? `${comment.firstName} ${comment.lastName}`
      : comment.authorUsername || "Unknown";
=======
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
>>>>>>> 7eff28f493f45a0c5c320b26d050cfe2f0458879

  return (
    <div className="border rounded p-4 mb-3 bg-white">
      <p className="font-semibold">{displayName}</p>

      {isEditing ? (
        <textarea
          className="w-full border p-2"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
      ) : (
        <p>{comment.content}</p>
      )}

<<<<<<< HEAD
      <div className="flex gap-2 mt-2">
        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        )}

        {canDelete && (
          <button
            onClick={() => onDelete(comment)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        )}

        {isEditing && (
          <>
            <button
              onClick={() => {
                onEdit({ ...comment, content: newContent });
                setIsEditing(false);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        )}
      </div>
=======
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
>>>>>>> 7eff28f493f45a0c5c320b26d050cfe2f0458879
    </div>
  );
}


// import { useState } from "react";
// import { useAuth } from "../auth/useAuth";

// export default function CommentItem({ comment, onEdit, onDelete }) {
//   const { user } = useAuth();

//   const isAuthor =
//     user && comment.author && user.username === comment.author.username;

//   const isAdmin = user?.role === "ADMIN";

//   const canEdit = isAuthor;
//   const canDelete = isAuthor || isAdmin;

//   const [isEditing, setIsEditing] = useState(false);
//   const [newContent, setNewContent] = useState(comment.content);

//   if (!comment) return null;

//   return (
//     <div className="border rounded p-4 mb-3 bg-white">
//       <p className="font-semibold">
//         {comment.author?.firstName} {comment.author?.lastName}
//       </p>

//       {isEditing ? (
//         <textarea
//           className="w-full border p-2"
//           value={newContent}
//           onChange={(e) => setNewContent(e.target.value)}
//         />
//       ) : (
//         <p>{comment.content}</p>
//       )}

//       <div className="flex gap-2 mt-2">
//         {canEdit && !isEditing && (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-blue-500 text-white px-3 py-1 rounded"
//           >
//             Edit
//           </button>
//         )}

//         {canDelete && (
//           <button
//             onClick={() => onDelete(comment)}
//             className="bg-red-500 text-white px-3 py-1 rounded"
//           >
//             Delete
//           </button>
//         )}

//         {isEditing && (
//           <>
//             <button
//               onClick={() => {
//                 onEdit({ ...comment, content: newContent });
//                 setIsEditing(false);
//               }}
//               className="bg-green-500 text-white px-3 py-1 rounded"
//             >
//               Save
//             </button>

//             <button
//               onClick={() => setIsEditing(false)}
//               className="bg-gray-400 px-3 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
