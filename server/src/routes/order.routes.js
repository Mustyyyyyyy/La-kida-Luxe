const router = require("express").Router();
const ctrl = require("../controllers/order.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", auth, ctrl.createOrder);
router.get("/my", auth, ctrl.myOrders);

router.get("/", auth, admin, ctrl.getOrders);
router.patch("/:id/status", auth, admin, ctrl.updateStatus);
router.delete("/:id", auth, admin, ctrl.deleteOrder); 

module.exports = router;