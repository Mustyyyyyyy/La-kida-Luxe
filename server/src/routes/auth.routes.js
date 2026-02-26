const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");

const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/auth.zod.js");

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);

module.exports = router;