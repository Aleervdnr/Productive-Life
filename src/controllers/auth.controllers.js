import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET, FRONTEND_URL } from "../config.js";
import sendVerificationEmail from "../libs/sendVerificationEmail.js";
import { generateVerificationToken } from "../libs/generateVerificationToken.js";

const createEmailText = (name, verificationLink, lang = "en") => {
  const firstName = name.split(" ")[0];

  const translations = {
    es: {
      subject: "Verificación de Email - Productive Life",
      greeting: `Hola ${firstName}, Bienvenido`,
      intro:
        "Gracias por registrarte en Productive Life. 🥳 Solo falta confirmar tu correo electrónico para activar tu cuenta. ¡Haz clic aquí! 👇",
      button: "Verificar mi email",
      note: "Si no reconoces este registro, no te preocupes, puedes ignorar este correo.",
      closing: "¡Esperamos que disfrutes de tu experiencia!",
      team: "El equipo de Productive Life",
    },
    en: {
      subject: "Email Verification - Productive Life",
      greeting: `Hi ${firstName}, Welcome`,
      intro:
        "Thanks for signing up for Productive Life. 🥳 Just one last step — confirm your email to activate your account. Click below! 👇",
      button: "Verify my email",
      note: "If you didn’t sign up, don’t worry, you can just ignore this email.",
      closing: "Hope you enjoy the experience!",
      team: "The Productive Life team",
    },
  };

  const t = translations[lang] || translations["en"];

  return {
    subject: t.subject,
    html: `    
      <table width="100%">
        <tr align="center">
          <td style="color: white;">
            <div class="container" style="width: 100%; max-width: 400px; background-color: #232429; color: white; padding: 20px 80px;">
              <table>
                <tr align="center">
                  <td style="color: white;">
                    <img src="https://res.cloudinary.com/dlhcxnvmq/image/upload/v1744718949/Logo_qfv8ho.png" alt="Logo" border="0" width="40%">
                  </td>
                </tr>
                <tr>
                  <td style="color: white;">
                    <h1 class="title" style="text-decoration: none;">${t.greeting}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: white;">
                    <p>${t.intro}</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color: white;">
                    <a class="button_link" href="${verificationLink}" style="background-color: #7e73ff; color: white; padding: 10px 25px; text-decoration: none; font-weight: bold; margin: 10px 0;">${t.button}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color: white;">
                    <p>${t.note}</p>
                  </td>
                </tr>
                <tr>
                  <td style="color: white;">
                    <p>${t.closing}</p>
                  </td>
                </tr>
                <tr>
                  <td style="color: white;">
                    <p>${t.team}</p>
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
    const { name, email, password, lang } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({ code: "EMAIL_IN_USE" });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken(email);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      isVerified: false,
      verificationToken,
      role: "tester",
    });

    const userSaved = await newUser.save();

    const verificationLink = `${FRONTEND_URL}/verify-email-token?token=${verificationToken}`;
    const emailText = createEmailText(name, verificationLink, lang);

    await sendVerificationEmail(email, emailText.subject, emailText.html);

    res.json(userSaved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
  }
};

export const registerWithGoogle = async (profile) => {
  try {
    const { id: googleId, displayName: name, emails } = profile;
    const email = emails[0].value;

    const userFound = await User.findOne({ $or: [{ email }, { googleId }] });
    if (userFound) return userFound;

    const newUser = new User({
      name,
      email,
      googleId,
      isVerified: true,
      provider: "google",
      role:"tester"
    });

    const userSaved = await newUser.save();
    return userSaved;
  } catch (err) {
    console.error(err);
    throw new Error("GOOGLE_REGISTER_ERROR");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ code: "EMAIL_NOT_FOUND" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({ code: "INVALID_PASSWORD" });

    if (!userFound.isVerified)
      return res.status(400).json({ code: "EMAIL_NOT_VERIFIED" });

    const token = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
    });

    res.json({ ...userFound.toObject(), token });
  } catch (error) {
    return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
  }
};

export const verifyToken = async (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ code: "UNAUTHORIZED" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ code: "INVALID_TOKEN" });
    }

    const userFound = await User.findById(user.id);
    if (!userFound) {
      return res.status(401).json({ code: "USER_NOT_FOUND" });
    }

    return res.json(userFound);
  });
};

export const verifyEmailToken = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ code: "TOKEN_REQUIRED" });

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const { email } = decoded;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ code: "USER_NOT_FOUND" });
    if (user.isVerified)
      return res.status(400).json({ code: "EMAIL_ALREADY_VERIFIED" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ code: "EMAIL_VERIFIED_SUCCESS" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: "TOKEN_EXPIRED" });
    }
    res.status(500).json({ code: "EMAIL_VERIFICATION_ERROR" });
  }
};

export const tourCompleted = async (req, res) => {
  try {
    const { userId, tourType, value } = req.body;
    const updateField = { [`tourCompleted.${tourType}`]: value };

    const updatedUser = await User.findByIdAndUpdate(userId, updateField, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ code: "USER_NOT_FOUND" });
    }

    res.status(200).json({ code: "TOUR_UPDATED", user: updatedUser });
  } catch (error) {
    res.status(500).json({ code: "TOUR_UPDATE_ERROR" });
  }
};

export const reSendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({ code: "EMAIL_NOT_REGISTERED" });

    if (userFound.isVerified)
      return res.status(400).json({ code: "EMAIL_ALREADY_VERIFIED" });

    const verificationToken = generateVerificationToken(email);
    const verificationLink = `${FRONTEND_URL}/verify-email-token?token=${verificationToken}`;
    const emailText = createEmailText(userFound.name, verificationLink);

    await sendVerificationEmail(email, emailText.subject, emailText.html);

    res.status(200).json({ code: "EMAIL_RESENT" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
  }
};
