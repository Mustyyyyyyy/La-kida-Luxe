const router = require("express").Router();
const { sendMail } = require("../config/mail");

router.get("/test-mail", async (req, res) => {
  try {
    const to = String(req.query.to || "").trim();
    if (!to) return res.status(400).json({ ok: false, message: "Missing ?to=" });

    await sendMail({
      to,
      subject: "LA'KIDA test email ✅",
      text: "If you got this, SMTP is working.",
      html: "<h2>LA'KIDA test email ✅</h2><p>SMTP is working.</p>",
    });

    res.json({ ok: true, message: "Sent" });
  } catch (e) {
    res.status(500).json({ ok: false, message: e?.message || "Failed" });
  }
});

module.exports = router;