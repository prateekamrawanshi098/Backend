import "./style/form.scss";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import useAuth from "./hooks/useAuth";


const Login = () => {
  const [emailOrUsername, setemailOrPassword] = useState("");
  const [password, setpassword] = useState("");

  const {user, handleLogin, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return <h1>LOADING...</h1>;
  }

  async function submitHandler(e) {
    e.preventDefault();

    try {
      const res = await handleLogin(emailOrUsername, password);
      console.log(res);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <div className="form-container">
        <form onSubmit={submitHandler} action="">
          <input
            onInput={(e) => {
              setemailOrPassword(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="enter username or email"
          />
          <input
            onInput={(e) => {
              setpassword(e.target.value);
            }}
            type="text"
            name="password"
            id=""
            placeholder="password"
          />
          <button>Login</button>
        </form>
        Don't have an account <Link to={"/register"}>register</Link>
      </div>
    </main>
  );
};

export default Login;
