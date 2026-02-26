const router = require("express").Router();
const ctrl = require("../controllers/newsletter.controller");
const { validate } = require("../middleware/validate");
const { subscribeSchema } = require("../validators/newsletter.zod");

router.post("/", validate(subscribeSchema), ctrl.subscribe);

module.exports = router;