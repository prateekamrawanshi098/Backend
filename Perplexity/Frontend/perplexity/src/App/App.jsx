import { RouterProvider } from "react-router";
import { router } from "./App.routes";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { loadCurrentUser } from "../Features/Auth/state/authSlice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  return (
   <RouterProvider router={router}/>
  );
};

export default App;
