const router = require("express").Router();
const ctrl = require("../controllers/order.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", ctrl.createOrder);

router.get("/", auth, admin, ctrl.getOrders);

router.patch("/:id/status", auth, admin, ctrl.updateStatus);

module.exports = router;