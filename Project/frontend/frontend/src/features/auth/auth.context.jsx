import { createContext, useState, useEffect } from "react";
import { login, registration, getMe } from "./services/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(false);

  const handleLogin = async (emailOrUsername, password) => {
    setloading(true);
    try {
      const response = await login(emailOrUsername, password);
      setUser(response.user);
      return response
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async function (username, email, password) {
    setloading(true);
    try {
      const response = await registration(username, email, password);
      setUser(response.user);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        handleLogin,
        handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
