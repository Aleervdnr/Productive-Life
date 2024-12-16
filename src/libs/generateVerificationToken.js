import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const generateVerificationToken = (email) => {
    const payload = { email };
    const secret = TOKEN_SECRET;
    const options = { expiresIn: "1h" }; // Token válido por 1 hora
    return jwt.sign(payload, secret, options);
  };