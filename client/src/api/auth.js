import axios from "./axios.js";

export const registerRequest = (user) => axios.post(`/register`, user);
export const loginRequest = (user) => axios.post(`/login`, user);
export const verifyTokenRequest = (token) =>
    axios.get("/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
export const verifyEmailRequest = (token) => axios.get(`verify-email-token?token=${token}`)

