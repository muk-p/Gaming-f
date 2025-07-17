import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Called after login to set user and store token
  const login = (token) => {
    localStorage.setItem('token', token);
    console.log(${token});
    axios.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(() => localStorage.removeItem('token'));
  };

  // Runs on initial app load to check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(() => {
      localStorage.removeItem('token');
      setUser(null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
