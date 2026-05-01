import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import {
  clearAuthMessage,
  loadCurrentUser,
  loginUser,
  logout,
  registerUser,
  selectAuth,
} from "../state/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const register = useCallback(
    (credentials) => dispatch(registerUser(credentials)).unwrap(),
    [dispatch],
  );

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)).unwrap(),
    [dispatch],
  );

  const getCurrentUser = useCallback(
    () => dispatch(loadCurrentUser()).unwrap(),
    [dispatch],
  );

  const clearMessage = useCallback(() => {
    dispatch(clearAuthMessage());
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    ...auth,
    register,
    login,
    getCurrentUser,
    clearMessage,
    logout: logoutUser,
  };
};
