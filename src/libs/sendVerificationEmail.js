import {
  EMAIL_USER,
  EMAIL_PASSWORD,
  OAUTH_CLIENTID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN,
} from "../config.js";

import { google } from "googleapis";

import nodemailer from "nodemailer";

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const createTransporter = async () => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      OAUTH_CLIENTID,
      OAUTH_CLIENT_SECRET,
      REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });

    // Generar el access token
    const accessToken = await oauth2Client.getAccessToken();

    // Configurar el transporte de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER, // Cambia por tu dirección de correo
        clientId: OAUTH_CLIENTID,
        clientSecret: OAUTH_CLIENT_SECRET,
        refreshToken: OAUTH_REFRESH_TOKEN,
        accessToken: accessToken, // Token generado dinámicamente
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error configurando Nodemailer con OAuth2:", error);
    throw error;
  }
};

// Función para enviar correos
export const sendVerificationEmail = async (to, subject, html) => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `"Productive Life" ${EMAIL_USER}`, // Remitente
      to, // Destinatario
      subject, // Asunto
      html, // Contenido del email
    });

    console.log("Correo enviado:", info.messageId);
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};

export default sendVerificationEmail;
