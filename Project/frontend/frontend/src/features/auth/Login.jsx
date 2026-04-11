import "./style/form.scss";
import { Link } from "react-router";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const [emailOrUsername, setemailOrPassword] = useState("");
  const [password, setpassword] = useState("");

  async function submitHandler(e) {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          email: emailOrUsername,
          username: emailOrUsername,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        console.log(res.data);
      });
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
