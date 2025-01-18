import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Assuming firebase is properly configured
import { onAuthStateChanged } from "firebase/auth";

// Create context
export const AuthContext = createContext();

// AuthContext Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
