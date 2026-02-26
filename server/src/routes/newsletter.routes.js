const router = require("express").Router();
const ctrl = require("../controllers/newsletter.controller");
const { validate } = require("../middleware/validate");
const { subscribeSchema } = require("../Validators/newsletter.zod");

router.post("/subscribe", validate(subscribeSchema), ctrl.subscribe);

module.exports = router;