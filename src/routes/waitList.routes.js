import { Router } from "express";
import WaitListEmail from "../models/waitListEmail.model.js";

const router = Router();

router.post("/waitlist", async (req, res) => {
  try {
    const { email } = req.body;
    const emailFound = await WaitListEmail.findOne({ email });
    
    if (emailFound) {
      return res.status(400).json({ code: "EMAIL_ALREADY_EXISTS" });
    }

    const newEntry = new WaitListEmail({ email });
    await newEntry.save();
    
    return res.status(201).json({ code: "EMAIL_REGISTERED" });
  } catch (error) {
    return res.status(500).json({ code: "INTERNAL_ERROR" });
  }
});


export default router;
