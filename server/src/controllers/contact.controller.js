const ContactMessage = require("../models/Contact");

exports.getMessages = async (req, res) => {
  try {
    const items = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not load messages" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    return res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not delete message" });
  }
};

exports.clearMessages = async (req, res) => {
  try {
    await ContactMessage.deleteMany({});
    return res.json({ message: "All messages deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not clear messages" });
  }
};