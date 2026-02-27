const router = require("express").Router();
const ctrl = require("../controllers/stockAlert.controller");
const auth = require("../middleware/auth");

router.post("/:productId", auth, ctrl.subscribe);
router.delete("/:productId", auth, ctrl.unsubscribe);

module.exports = router;