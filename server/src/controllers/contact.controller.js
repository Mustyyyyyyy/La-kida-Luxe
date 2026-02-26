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

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.validated.params;
    const { status } = req.validated.body;

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Message not found" });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};