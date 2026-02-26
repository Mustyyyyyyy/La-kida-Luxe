const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");

const { validate } = require("../middleware/validate");
const {
  sendContactSchema,
  updateContactStatusSchema,
} = require("../validators/contact.zod"); // ✅ lowercase

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", validate(sendContactSchema), ctrl.sendMessage);

router.get("/", auth, admin, ctrl.listMessages);

router.patch(
  "/:id/status",
  auth,
  admin,
  validate(updateContactStatusSchema),
  ctrl.updateStatus
);

module.exports = router;