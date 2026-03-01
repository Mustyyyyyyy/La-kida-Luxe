const User = require("../models/User");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fullName email phone address role");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not load profile" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body || {};

    const update = {};
    if (fullName !== undefined) update.fullName = String(fullName).trim();
    if (phone !== undefined) update.phone = String(phone).trim();
    if (address !== undefined) update.address = String(address).trim();

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    }).select("fullName email phone address role");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not update profile" });
  }
};