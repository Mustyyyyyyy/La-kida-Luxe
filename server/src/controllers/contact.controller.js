const Contact = require("../models/Contact"); 

exports.createMessage = async (req, res) => {
  try {
    const body = req.body || {};
    const saved = await Contact.create(body);
    return res.status(201).json(saved);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not load messages" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    return res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not delete message" });
  }
};