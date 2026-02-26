require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

async function seedAdmin() {
  try {
    await connectDB(process.env.MONGO_URI);

    const fullName = process.env.ADMIN_FULLNAME || "Admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
      process.exit(1);
    }

    const exists = await User.findOne({ email });

    if (exists) {
  
      if (exists.role !== "admin") {
        exists.role = "admin";
        await exists.save();
        console.log(`Updated existing user to admin: ${email}`);
      } else {
        console.log(`ℹAdmin already exists: ${email}`);
      }
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hash,
      role: "admin",
    });

    console.log(`Admin created: ${email}`);
    process.exit(0);
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  }
}

seedAdmin();