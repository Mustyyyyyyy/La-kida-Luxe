const ContactMessage = require("../models/ContactMessage");

exports.sendMessage = async (req, res) => {
  try {
    const data = req.validated.body;

    const created = await ContactMessage.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message,
    });

    return res.json({
      message: "Message sent successfully",
      id: created._id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listMessages = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
};