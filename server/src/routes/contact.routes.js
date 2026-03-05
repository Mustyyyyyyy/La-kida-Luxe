const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", ctrl.createMessage);

router.get("/", auth, admin, ctrl.getMessages);
router.delete("/:id", auth, admin, ctrl.deleteMessage);

module.exports = router;