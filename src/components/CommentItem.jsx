import { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function CommentItem({ comment, onEdit, onDelete }) {
  const { user } = useAuth();

  const isAuthor =
    user && comment.author && user.username === comment.author.username;

  const isAdmin = user?.role === "ADMIN";

  const canEdit = isAuthor;
  const canDelete = isAuthor || isAdmin;

  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);

  if (!comment) return null;

  return (
    <div className="border rounded p-4 mb-3 bg-white">
      <p className="font-semibold">
        {comment.author?.firstName} {comment.author?.lastName}
      </p>

      {isEditing ? (
        <textarea
          className="w-full border p-2"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
      ) : (
        <p>{comment.content}</p>
      )}

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
    </div>
  );
}
