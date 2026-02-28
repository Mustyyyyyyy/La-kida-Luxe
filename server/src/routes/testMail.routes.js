const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { sendMail } = require("../config/mail");

router.post("/", auth, admin, async (req, res) => {
  try {
    const to = req.body.to;
    if (!to) return res.status(400).json({ message: "to is required" });

    const info = await sendMail({
      to,
      subject: "LA'KIDA test email ✅",
      text: "If you got this, Brevo SMTP is working.",
      html: "<h2>LA'KIDA test email ✅</h2><p>If you got this, Brevo SMTP is working.</p>",
    });

    res.json({ message: "Sent", info });
  } catch (e) {
    console.error("TEST MAIL ERROR:", e);
    res.status(500).json({ message: e?.message || "Test email failed" });
  }
});

module.exports = router;