const Subscriber = require("../models/Subscriber");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.validated.body;

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email, source: "website" });
    return res.json({ message: "Subscribed successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};