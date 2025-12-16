import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  if (!post) return null; // or a loading placeholder

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
      <p>{post.content?.substring(0, 100)}...</p>
      <Link
        to={`/posts/${post.id}`}
        className="text-indigo-600 hover:underline mt-2 inline-block"
      >
        Read more
      </Link>
    </div>
  );
}

// import { Link } from "react-router-dom";

// export default function PostCard({ post }) {
//   return (
//     <div className="border p-4 rounded shadow">
//       <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
//       <p>{post.content.substring(0, 100)}...</p>
//       <Link
//         to={`/posts/${post.id}`}
//         className="text-indigo-600 hover:underline mt-2 inline-block"
//       >
//         Read more
//       </Link>
//     </div>
//   );
// }
