import { createBrowserRouter } from "react-router";

import Login from "../features/auth/Login";
import Register from "../features/auth/Register";

export const routes = createBrowserRouter([

  {
    path: "/",
    element: <h1>Welcome to Instagram</h1>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
