const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const auth = require("../middleware/auth");


router.get("/me", auth, ctrl.getMe);
router.patch("/me", auth, ctrl.updateMe);

module.exports = router;