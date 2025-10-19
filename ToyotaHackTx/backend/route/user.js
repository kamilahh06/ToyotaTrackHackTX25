import express from "express";
import { User } from "../models/User.js"; // MongoDB model
const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phoneNumber, password, ssn } = req.body;

    // Check for missing fields
    if (!name || !email || !phoneNumber || !password || !ssn) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create user
    const newUser = new User({ name, email, phoneNumber, password, ssn });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: "Server error while registering" }); // 💥 this line is essential
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email || !phoneNumber) {
      return res.status(400).json({ error: "Email and phone number required" });
    }

    const user = await User.findOne({ email, phoneNumber });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Server error while logging in" }); // 💥 important
  }
});

export default router;
