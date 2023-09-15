// UserContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return null;
    else return JSON.parse(storedUser);
  });

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = async () => {
    setUser(null);
    localStorage.removeItem("user");

    const res = await axios.get("/auth/user/logout");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
