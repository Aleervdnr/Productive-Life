import { Router } from "express";
import WaitListEmail from "../models/waitListEmail.model.js"

const router = Router();

router.post("/waitlist", async (req, res) => {
  try {
    const { email } = req.body;
    const newEntry = new WaitListEmail({ email });
    await newEntry.save();
    res.status(201).json({ message: "Email registrado con éxito" });
  } catch (error) {
    res.status(400).json({ error: "Error al registrar email" });
  }
});
