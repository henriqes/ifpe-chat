import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

export async function register(name, username, email, password) {

    const response = await api.post("/auth/register", {
        name,
        username,
        email,
        password
    });

    return response.data;
}

export async function login(username, password) {

    const response = await api.post("/auth/login", {
        username,
        password
    });

    return response.data;
}

export default api;