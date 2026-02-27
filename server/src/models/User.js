const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);