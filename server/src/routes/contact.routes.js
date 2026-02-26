const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", ctrl.sendMessage);

router.get("/", auth, admin, ctrl.listMessages);

router.patch("/:id/status", auth, admin, ctrl.updateStatus);

module.exports = router;