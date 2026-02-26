const router = require("express").Router();
const ctrl = require("../controllers/newsletter.controller");

router.post("/", ctrl.subscribe);

module.exports = router;