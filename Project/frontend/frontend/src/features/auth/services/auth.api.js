import axios from "axios";

const baseAPI = axios.create({
 baseURL: "http://localhost:3000/api/auth", 

  
  withCredentials: true,
}
);

export async function registration(username, email, password) {
  const respons = await baseAPI.post("/register", {
    email,
    username,
    password,
  });

  return respons.data;
}

export async function login(emailOrusername, password) {
  const response = await baseAPI.post("/login", {
    email: emailOrusername,
    username:emailOrusername,
    password,
  });
  return response.data;
}


export async function getMe() {
  const response = await baseAPI.get("/get-me")
  return response.data
}