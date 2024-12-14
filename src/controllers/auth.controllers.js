import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { TOKEN_SECRET } from "../config.js";
import sendVerificationEmail from "../libs/sendVerificationEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json(["El email indicado ya está en uso"]);

    const passwordHash = await bcrypt.hash(password, 10);

    // Generar el token de verificación
    const verificationToken = crypto.randomUUID();

    // Crear nuevo usuario con estado no verificado
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      isVerified: false,
      verificationToken,
    });

    const userSaved = await newUser.save();

    // Crear el enlace de verificación
    const verificationLink = `http://productivelife.site/verify-email?token=${verificationToken}`;

    // Enviar el correo de verificación
    await sendVerificationEmail(
      email,
      "Verificación de Email - Productive Life",
      `    
    <table width="100%">
      <tr align="center">
        <td style="color: white;">
          <div class="container" style="width: 100%; max-width: 400px; background-color: #232429; color: white; padding: 20px 80px;">
            <table>
              <tr align="center">
                <td style="color: white;">
                  <img src="https://i.ibb.co/4MbRB40/Logo.png" alt="Logo" border="0" width="40%">
                </td>
              </tr>
              <tr>
                <td style="color: white;">
                  <h1 class="title" style="text-decoration: none;">Hola ${name}, Bienvenido</h1>
                </td>
              </tr>
              <tr>
                <td style="color: white;">
                  <p>
                    Gracias por registrarte en Productive Life. 🥳 Solo falta
                    confirmar tu correo electrónico para activar tu cuenta. ¡Haz
                    clic aquí! 👇
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="color: white;">
                  <a class="button_link" href="${verificationLink}" style="background-color: #7e73ff; color: white; padding: 5px 15px; text-decoration: none; font-weight: bold; margin: 10px 0;">Verificar mi email</a>
                </td>
              </tr>
              <tr>
                <td style="color: white;">
                  <p>
                    Si no reconoces este registro, no te preocupes, puedes
                    ignorar este correo.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="color: white;">
                  <p>
                    ¡Esperamos que disfrutes de tu experiencia!
                  </p>
                </td>
              </tr>
              <tr>
                <td style="color: white;">
                  <p>
                    El equipo de Productive Life
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>`
    );

    const token = await createAccessToken({ id: userSaved._id });

    res.json({
      _id: userSaved._id,
      name: userSaved.name,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt,
      token: token,
    });
  } catch (err) {
    console.error(err); // Agrega esto para depurar el error
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json(["El email indicado no existe"]);

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json(["Contraseña incorrecta"]);

    const token = await createAccessToken({ id: userFound._id });

    res.json({
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updateAt: userFound.updatedAt,
      token: token,
    });
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const verifyToken = async (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json(["No Autorizado"]);

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json(["No Autorizado"]);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json(["No Autorizado"]);

    return res.json({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
    });
  });
};
