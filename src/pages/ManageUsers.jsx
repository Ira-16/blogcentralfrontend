import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getAllUsers, deleteUser, updateUser } from "../api/apiService";
//import { useAuth } from "../auth/useAuth";

export default function ManageUsers() {
  //const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditForm({ ...user });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveUser = async () => {
    try {
      // Send the updated user object to backend
      await updateUser(editingUserId, editForm);
      setUsers(
        users.map((u) => (u.id === editingUserId ? { ...editForm } : u))
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">First Name</th>
              <th className="border px-2 py-1">Last Name</th>
              <th className="border px-2 py-1">Username</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border px-2 py-1">{user.id}</td>
                <td className="border px-2 py-1">
                  {editingUserId === user.id ? (
                    <input
                      name="firstName"
                      value={editForm.firstName || ""}
                      onChange={handleInputChange}
                      className="border px-1 py-0.5"
                    />
                  ) : (
                    user.firstName
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editingUserId === user.id ? (
                    <input
                      name="lastName"
                      value={editForm.lastName || ""}
                      onChange={handleInputChange}
                      className="border px-1 py-0.5"
                    />
                  ) : (
                    user.lastName
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editingUserId === user.id ? (
                    <input
                      name="username"
                      value={editForm.username || ""}
                      onChange={handleInputChange}
                      className="border px-1 py-0.5"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editingUserId === user.id ? (
                    <input
                      name="email"
                      value={editForm.email || ""}
                      onChange={handleInputChange}
                      className="border px-1 py-0.5"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editingUserId === user.id ? (
                    <>
                      <input
                        name="street"
                        value={editForm.street || ""}
                        onChange={handleInputChange}
                        className="border px-1 py-0.5 w-20"
                        placeholder="Street"
                      />
                      <input
                        name="houseNr"
                        value={editForm.houseNr || ""}
                        onChange={handleInputChange}
                        className="border px-1 py-0.5 w-12"
                        placeholder="Nr"
                      />
                      <input
                        name="city"
                        value={editForm.city || ""}
                        onChange={handleInputChange}
                        className="border px-1 py-0.5 w-20"
                        placeholder="City"
                      />
                      <input
                        name="zip"
                        value={editForm.zip || ""}
                        onChange={handleInputChange}
                        className="border px-1 py-0.5 w-16"
                        placeholder="ZIP"
                      />
                    </>
                  ) : (
                    `${user.street} ${user.houseNr}, ${user.city} ${user.zip}`
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editingUserId === user.id ? (
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleInputChange}
                      className="border px-1 py-0.5"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="AUTHOR">AUTHOR</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="border px-2 py-1 flex justify-center gap-2">
                  {editingUserId === user.id ? (
                    <>
                      <Button
                        onClick={saveUser}
                        className="bg-green-500 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => startEditing(user)}
                        className="bg-blue-500 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { Button } from "../components/ui/button";
// import { getAllUsers, deleteUser, updateUser } from "../api/apiService";
// import { useAuth } from "../auth/useAuth";

// export default function ManageUsers() {
//   const { user: currentUser } = useAuth(); // logged-in user
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllUsers();
//       setUsers(res.data);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await deleteUser(id);
//       setUsers(users.filter((user) => user.id !== id));
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//     }
//   };

//   const startEditing = (user) => {
//     setEditingUserId(user.id);
//     setEditForm({ ...user });
//   };

//   const cancelEditing = () => {
//     setEditingUserId(null);
//     setEditForm({});
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const saveUser = async () => {
//     try {
//       await updateUser(editingUserId, editForm);
//       setUsers(users.map((u) => (u.id === editingUserId ? editForm : u)));
//       cancelEditing();
//     } catch (error) {
//       console.error("Failed to update user:", error);
//     }
//   };

//   const handleRoleChange = (id, newRole) => {
//     setEditForm((prev) => ({ ...prev, role: newRole }));
//   };

//   if (loading) return <p className="p-4">Loading users...</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
//       {users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border px-2 py-1">ID</th>
//               <th className="border px-2 py-1">First Name</th>
//               <th className="border px-2 py-1">Last Name</th>
//               <th className="border px-2 py-1">Username</th>
//               <th className="border px-2 py-1">Email</th>
//               <th className="border px-2 py-1">Address</th>
//               <th className="border px-2 py-1">Role</th>
//               <th className="border px-2 py-1">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="text-center">
//                 <td className="border px-2 py-1">{user.id}</td>

//                 <td className="border px-2 py-1">
//                   {editingUserId === user.id ? (
//                     <input
//                       name="firstName"
//                       value={editForm.firstName || ""}
//                       onChange={handleInputChange}
//                       className="border px-1 py-0.5"
//                     />
//                   ) : (
//                     user.firstName
//                   )}
//                 </td>

//                 <td className="border px-2 py-1">
//                   {editingUserId === user.id ? (
//                     <input
//                       name="lastName"
//                       value={editForm.lastName || ""}
//                       onChange={handleInputChange}
//                       className="border px-1 py-0.5"
//                     />
//                   ) : (
//                     user.lastName
//                   )}
//                 </td>

//                 <td className="border px-2 py-1">
//                   {editingUserId === user.id ? (
//                     <input
//                       name="username"
//                       value={editForm.username || ""}
//                       onChange={handleInputChange}
//                       className="border px-1 py-0.5"
//                     />
//                   ) : (
//                     user.username
//                   )}
//                 </td>

//                 <td className="border px-2 py-1">
//                   {editingUserId === user.id ? (
//                     <input
//                       name="email"
//                       value={editForm.email || ""}
//                       onChange={handleInputChange}
//                       className="border px-1 py-0.5"
//                     />
//                   ) : (
//                     user.email
//                   )}
//                 </td>

//                 <td className="border px-2 py-1">
//                   {editingUserId === user.id ? (
//                     <>
//                       <input
//                         name="street"
//                         value={editForm.street || ""}
//                         onChange={handleInputChange}
//                         className="border px-1 py-0.5 w-20"
//                         placeholder="Street"
//                       />
//                       <input
//                         name="houseNr"
//                         value={editForm.houseNr || ""}
//                         onChange={handleInputChange}
//                         className="border px-1 py-0.5 w-12"
//                         placeholder="Nr"
//                       />
//                       <input
//                         name="city"
//                         value={editForm.city || ""}
//                         onChange={handleInputChange}
//                         className="border px-1 py-0.5 w-20"
//                         placeholder="City"
//                       />
//                       <input
//                         name="zip"
//                         value={editForm.zip || ""}
//                         onChange={handleInputChange}
//                         className="border px-1 py-0.5 w-16"
//                         placeholder="ZIP"
//                       />
//                     </>
//                   ) : (
//                     `${user.street} ${user.houseNr}, ${user.city} ${user.zip}`
//                   )}
//                 </td>

//                 <td className="border px-2 py-1">
//                   {editingUserId === user.id ? (
//                     <select
//                       value={editForm.role}
//                       onChange={(e) =>
//                         handleRoleChange(user.id, e.target.value)
//                       }
//                       className="border px-1 py-0.5"
//                     >
//                       <option value="USER">USER</option>
//                       <option value="ADMIN">ADMIN</option>
//                       <option value="EDITOR">EDITOR</option>
//                       <option value="AUTHOR">AUTHOR</option>
//                     </select>
//                   ) : (
//                     user.role
//                   )}
//                 </td>

//                 <td className="border px-2 py-1 flex justify-center gap-2">
//                   {editingUserId === user.id ? (
//                     <>
//                       <Button
//                         onClick={saveUser}
//                         className="bg-green-500 text-white"
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         onClick={cancelEditing}
//                         className="bg-gray-400 text-white"
//                       >
//                         Cancel
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         onClick={() => startEditing(user)}
//                         className="bg-blue-500 text-white"
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         onClick={() => handleDelete(user.id)}
//                         className="bg-red-500 text-white"
//                       >
//                         Delete
//                       </Button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
