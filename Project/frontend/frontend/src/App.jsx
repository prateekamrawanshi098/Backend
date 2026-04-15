import React from "react";
import { RouterProvider } from "react-router";
import { routes } from "./routes/Router";
import "./style.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { PostContext, PostContextProvider } from "./features/post/Post.context";

const App = () => {
  return (
    <PostContextProvider>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </PostContextProvider>
  );
};

export default App;
