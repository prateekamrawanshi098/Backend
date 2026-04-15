import React, { useState } from "react";
import "./style/form.scss";
import { Link, useNavigate } from "react-router";
import useAuth from "./hooks/useAuth";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await handleRegister(username, email, password);
      console.info("User successfully registered:", response?.user || response);
      setSuccessMessage("User successfully registered");
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Registration failed";
      console.error("Registration failed:", message);
      setErrorMessage(String(message));
    }
  }

  if (loading) {
    return <h1>LOADING....</h1>;
  }

  return (
    <main>
      <h1>Registration</h1>
      <div className="form-container">
        <form onSubmit={handleFormSubmit} action="">
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
        {successMessage ? <p className="success-text">{successMessage}</p> : null}
        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
        <p>
          Already has an account <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
