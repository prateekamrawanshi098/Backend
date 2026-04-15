import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, registration } from "../services/auth.api";

const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setloading } = context;
  const handleLogin = async (emailOrUsername, password) => {
    setloading(true);
    try {
      const response = await login(emailOrUsername, password);
      setUser(response.user || response.isUserExits);
      return response;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async function (username, email, password) {
    setloading(true);
    try {
      const response = await registration(username, email, password);
      setUser(response.user);
      console.info("Register API success:", response);
      return response;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    } finally {
      setloading(false);
    }
  };

  const handleGetMe = async () => {
    setloading(true);
    try {
      const response = await getMe();
      setUser(response.user);
      return response;
    } catch (err) {
      console.error("Get me error:", err.response?.data || err.message);
      throw err;
    } finally {
      setloading(false);
    }
  };

  return { user, loading, handleLogin, handleRegister, handleGetMe };
};

export default useAuth;
