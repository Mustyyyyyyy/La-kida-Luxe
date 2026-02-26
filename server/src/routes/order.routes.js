const router = require("express").Router();
const ctrl = require("../controllers/order.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { validate } = require("../middleware/validate");
const { createOrderSchema, updateOrderStatusSchema } = require("../validators/order.zod");

router.post("/", validate(createOrderSchema), ctrl.createOrder);

router.get("/", auth, admin, ctrl.listOrders);
router.patch("/:id/status", auth, admin, validate(updateOrderStatusSchema), ctrl.updateOrderStatus);

module.exports = router;