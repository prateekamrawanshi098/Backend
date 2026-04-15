import { createContext, useState,  } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(false);

  

  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        setloading
      
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
