const nodemailer = require("nodemailer");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const SMTP_HOST = requireEnv("SMTP_HOST");
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = requireEnv("SMTP_USER");
const SMTP_PASS = requireEnv("SMTP_PASS");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendMail({ to, subject, html, text, replyTo }) {
  const FROM =
    process.env.MAIL_FROM || process.env.EMAIL_FROM || SMTP_USER; 
  const REPLY_TO = replyTo || process.env.MAIL_REPLY_TO || undefined;

  return transporter.sendMail({
    from: FROM,             
    to,
    subject,
    text,
    html,
    ...(REPLY_TO ? { replyTo: REPLY_TO } : {}),
  });
}

module.exports = { transporter, sendMail };