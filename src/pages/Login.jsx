import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.token;

      if (!token) {
        alert("Login failed: no token");
        return;
      }

      // 🔐 Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split(".")[1]));

      const user = {
        username: payload.sub,
        role: payload.role, // ADMIN or USER
      };

      login(token, user);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
          className="border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios"; // your axios instance
// import { useAuth } from "../auth/useAuth";

// export default function Login() {
//   const { login } = useAuth(); // login function from AuthProvider
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // Call your backend login API
//       const res = await api.post("/auth/login", form);

//       // Save both token and user info in AuthProvider
//       login(res.data.token, res.data.user);

//       alert("Login successful!");
//       navigate("/"); // redirect to home
//     } catch (err) {
//       console.error(err);
//       alert("Invalid credentials or server error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
//       <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={form.username}
//           onChange={handleChange}
//           required
//           className="border p-2 rounded"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//           className="border p-2 rounded"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
