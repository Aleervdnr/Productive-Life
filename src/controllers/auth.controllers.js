import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json(["El email indicado ya esta en uso"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: passwordHash });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });
    res.json({
      _id: userSaved._id,
      name: userSaved.name,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt,
      token: token
    });
  } catch (err) {}
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
      token: token
    });
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const verifyToken = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

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
