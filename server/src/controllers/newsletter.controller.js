const Newsletter = require("../models/Newsletter");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "email is required" });

    const exists = await Newsletter.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.json({ message: "Already subscribed" });

    await Newsletter.create({ email: String(email).toLowerCase() });

    res.json({ message: "Subscribed successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};