import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json(["Autorizacion denegada"]);

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json(["Token no valido"]);
      req.user = user;
      console.log(user)
      next();
    });
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};
