import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/config/database.js";
import User from "../src/model/User.js";

const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!name || !email || !password) {
  console.error(
    "Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before running this script."
  );
  process.exit(1);
}

if (password.length < 6) {
  console.error("ADMIN_PASSWORD must be at least 6 characters long.");
  process.exit(1);
}

try {
  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.name = name;
    existingUser.password = passwordHash;
    existingUser.role = "admin";
    existingUser.active = true;
    await existingUser.save();
    console.log(`Admin account updated: ${email}`);
  } else {
    await User.create({
      name,
      email,
      password: passwordHash,
      role: "admin",
      active: true,
    });
    console.log(`Admin account created: ${email}`);
  }
} catch (error) {
  console.error("Failed to create admin account:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
