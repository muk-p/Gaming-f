import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Runs once on load — restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Simulated login (no backend)
  const login = (email = "user@example.com", password = "123456") => {
    // you could add simple validation if you want
    const mockUser = {
      id: 1,
      name: "Demo User",
      email,
      role: email === "admin@example.com" ? "admin" : "user",
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  // Logout (clear local session)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

