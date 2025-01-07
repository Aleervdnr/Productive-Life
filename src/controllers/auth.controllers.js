import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET, FRONTEND_URL } from "../config.js";
import sendVerificationEmail from "../libs/sendVerificationEmail.js";
import { generateVerificationToken } from "../libs/generateVerificationToken.js";

const createEmailText = (name, verificationLink) => {
  return {
    subject: "Verificación de Email - Productive Life",
    html: `    
      <table width="100%">
        <tr align="center">
          <td style="color: white;">
            <div class="container" style="width: 100%; max-width: 400px; background-color: #232429; color: white; padding: 20px 80px;">
              <table>
                <tr align="center">
                  <td style="color: white;">
                    <img src="https://iili.io/2SLraDv.png" alt="Logo" border="0" width="40%">
                  </td>
                </tr>
                <tr>
                  <td style="color: white;">
                    <h1 class="title" style="text-decoration: none;">Hola ${
                      name.split(" ")[0]
                    }, Bienvenido</h1>
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
                    <a class="button_link" href="${verificationLink}" style="background-color: #7e73ff; color: white; padding: 10px 25px; text-decoration: none; font-weight: bold; margin: 10px 0;">Verificar mi email</a>
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
      </table>`,
  };
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json(["El email indicado ya está en uso"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = generateVerificationToken(email);

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
    const verificationLink = `${FRONTEND_URL}/verify-email-token?token=${verificationToken}`;

    const emailText = createEmailText(name, verificationLink);

    // Enviar el correo de verificación
    await sendVerificationEmail(email, emailText.subject, emailText.html);

    res.json(userFound);
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

    if (!userFound.isVerified)
      return res
        .status(400)
        .json(["Email no verificado, revisa tu casilla de mensajes"]);

    const token = await createAccessToken({ id: userFound._id });

    res.json({ ...userFound.toObject(), token: token });
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

    return res.json(userFound);
  });
};

export const verifyEmailToken = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .json({ message: "Token de verificación requerido." });
  }

  try {
    // Decodificar y verificar el token
    const decoded = jwt.verify(token, TOKEN_SECRET);

    const { email } = decoded;

    // Buscar al usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "El email ya ha sido verificado." });
    }

    // Actualizar el estado del usuario a "verificado"
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verificado exitosamente." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "El token ha expirado. Solicita un nuevo enlace." });
    }
    res
      .status(500)
      .json({ message: "Error al verificar el email.", error: error.message });
  }
};

export const tourCompleted = async (req, res) => {
  try {
    const { userId, tourType, value } = req.body; // Recibe el ID del usuario, el tipo de tour y el nuevo valor

    // Construimos dinámicamente el campo a actualizar
    const updateField = { [`tourCompleted.${tourType}`]: value };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateField,
      { new: true } // Retorna el usuario actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Estado actualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado", error });
  }
};

export const reSendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json(["El email indicado no está registrado"]);

    if(userFound.isVerified) return res.status(400).json(["El email indicado ya se encuentra verificado"]);

    const verificationToken = generateVerificationToken(email);

    const verificationLink = `${FRONTEND_URL}/verify-email-token?token=${verificationToken}`;

    const emailText = createEmailText(userFound.name, verificationLink);

    const response = await sendVerificationEmail(
      email,
      emailText.subject,
      emailText.html
    );

    res.status(200).json({ message: "Email Reenviado." });
  } catch (error) {
    console.error(error); // Agrega esto para depurar el error
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
