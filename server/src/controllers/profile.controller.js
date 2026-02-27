const User = require("../models/User");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id fullName email role phone address createdAt"
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body || {};

    const updates = {};
    if (typeof fullName === "string") updates.fullName = fullName.trim();
    if (typeof phone === "string") updates.phone = phone.trim();
    if (typeof address === "string") updates.address = address.trim();

    // basic validation
    if (updates.fullName && updates.fullName.length < 2) {
      return res.status(400).json({ message: "Full name must be at least 2 characters" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("_id fullName email role phone address createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "Profile updated", user });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};