const router = require("express").Router();
const ctrl = require("../controllers/order.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// ✅ MUST be logged in to place an order
router.post("/", auth, ctrl.createOrder);

// customer orders
router.get("/my", auth, ctrl.myOrders);

// admin only
router.get("/", auth, admin, ctrl.getOrders);
router.patch("/:id/status", auth, admin, ctrl.updateStatus);

module.exports = router;