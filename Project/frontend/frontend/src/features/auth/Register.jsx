import React, { useState } from "react";
import "./style/form.scss";
import { Link } from "react-router";
import axios from "axios";

const Register = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  async function handleFormSubmit(e) {
    e.preventDefault();

    axios.post("http://localhost:3000/api/auth/register", {
      username,
      email,
      password,
    }, {
        withCredentials:true
    }).then(res => {
        console.log(res.data);
    });
  }

  return (
    <main>
      <h1>Registration</h1>
      <div className="form-container">
              <form
                  onSubmit={handleFormSubmit}
                  action="">
          <input
            onInput={(e) => {
              setemail(e.target.value);
            }}
            type="text"
            name=""
            id=""
            placeholder="enter email"
          />
          <input
            onInput={(e) => {
              setusername(e.target.value);
            }}
            type="text"
            placeholder="enter username"
          />
          <input
            onInput={(e) => {
              setpassword(e.target.value);
            }}
            type="text"
            name=""
            id=""
            placeholder="enter password"
          />
          <button>Register</button>
        </form>
        <p>
          Already has an account <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
