const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.email) {
      req.user = {
        id: payload.id,
        role: payload.role,
        email: payload.email,
        fullName: payload.fullName,
      };
      return next();
    }

    const user = await User.findById(payload.id).select("email fullName role");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      fullName: user.fullName,
    };

    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};