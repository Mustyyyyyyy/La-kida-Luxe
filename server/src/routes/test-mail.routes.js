const router = require("express").Router();
const { sendMail } = require("../config/mail");

router.get("/", async (req, res) => {
  try {
    const to = req.query.to;
    if (!to) return res.status(400).json({ message: "Pass ?to=email@example.com" });

    const info = await sendMail({
      to,
      subject: "LA'KIDA Test Email ✅",
      text: "If you got this, SMTP is working.",
      html: "<h2>SMTP working ✅</h2><p>If you got this, Brevo SMTP works.</p>",
    });

    res.json({ ok: true, info });
  } catch (e) {
    console.error("TEST MAIL ERROR:", e);
    res.status(500).json({ ok: false, message: e?.message || "Mail failed" });
  }
});

module.exports = router;