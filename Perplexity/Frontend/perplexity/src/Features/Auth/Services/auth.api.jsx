import axios from "axios"

const api = axios.create(
    {
        baseURL: "http://localhost:3001/api/auth",
        withCredentials: true
    }
)

export async function registration({email,username,password}) {
    const response = await api.post("/register", { email, username, password })
    return response.data
}

export async function login({email,password}) {
    const response = await api.post("/login", { email, password })
    return response.data
}

export async function  getme() {
    const response = await api.get("/get-me")
    return response.data
}
