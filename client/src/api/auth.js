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

export const reSendEmailRequest = (user) => axios.post("/resend-email-verify", user)

export const completeTourRequest = (tourType,userId) =>
  axios.patch("/tour-completed", {
    userId, // Reemplaza con el ID del usuario actual
    tourType: tourType, // Nombre del tour, por ejemplo: "taskTour" o "gastosPage"
    value: true, // El nuevo valor, en este caso siempre "true"
  });

