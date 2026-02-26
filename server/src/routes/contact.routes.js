const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");

const { validate } = require("../middleware/validate");
const { sendContactSchema } = require("../Validators/contact.zod");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", validate(sendContactSchema), ctrl.sendMessage);

router.get("/", auth, admin, ctrl.listMessages);

module.exports = router;