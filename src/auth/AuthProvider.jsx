import { useState } from "react";
import { AuthContext } from "./AuthContext";

// Safe parse function
const safeParseJSON = (value) => {
  try {
    return value && value !== "undefined" ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(safeParseJSON(localStorage.getItem("user")));

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// import { useState } from "react";
// import { AuthContext } from "./AuthContext";

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));

//   const login = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
