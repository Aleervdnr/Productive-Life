import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import waitListRoutes from "./routes/waitList.routes.js"
import cors from "cors";
import { OAUTH_CLIENT_SECRET,FRONTEND_URL, OAUTH_CLIENTID, TOKEN_SECRET } from "./config.js";
import User from "./models/user.model.js";
import { registerWithGoogle } from "./controllers/auth.controllers.js";
import { generateVerificationToken } from "./libs/generateVerificationToken.js";
import { createAccessToken } from "./libs/jwt.js";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Configuración de sesión
app.use(
  session({
    secret: TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: OAUTH_CLIENTID,
      clientSecret: OAUTH_CLIENT_SECRET,
      callbackURL: 'https://productive-life-api.onrender.com/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await registerWithGoogle(profile);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Rutas de autenticación
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Ruta de callback después de la autenticación con Google
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    // Generar un token JWT para el frontend
    const token = await createAccessToken({ id: req.user._id }); // Implementa esta función para generar tokens
    res.redirect(`https://productivelife.site/auth/google/callback/auth/callback?token=${token}`);
  }
);

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", tasksRoutes);
app.use("/api", waitListRoutes)

export default app;
