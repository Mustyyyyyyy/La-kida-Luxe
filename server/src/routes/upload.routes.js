const router = require("express").Router();
const ctrl = require("../controllers/upload.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

router.post("/product-images", auth, admin, upload.array("images", 8), ctrl.uploadProductImages);

module.exports = router;