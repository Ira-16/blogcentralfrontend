import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Account created!");
    } catch {
      alert("Error creating account");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="First name"
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />
        <input
          placeholder="Last name"
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />
        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Create Account</button>
      </form>
    </div>
  );
}
