import React from "react";
import { RouterProvider } from "react-router";
import { routes } from "./routes/Router";
import "./style.scss";
import { AuthProvider } from "./features/auth/auth.context";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
};

export default App;
