import { Router } from "express";
import WaitListEmail from "../models/waitListEmail.model.js"

const router = Router();

router.post("/waitlist", async (req, res) => {
  try {
    const { email } = req.body;
    const emailFound = await WaitListEmail.findOne({ email });
    if(emailFound)return res.status(400).json(["El email indicado ya esta agregado a la lista de espera"])
      
    const newEntry = new WaitListEmail({ email });
    await newEntry.save();
    res.status(201).json({ message: "Email registrado con éxito" });
  } catch (error) {
    res.status(400).json({ error: "Error al registrar email" });
  }
});

export default router
