const router = require("express").Router();
const ctrl = require("../controllers/product.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", ctrl.getProducts);
router.get("/:id", ctrl.getProductById);

router.post("/", auth, admin, ctrl.createProduct);
router.put("/:id", auth, admin, ctrl.updateProduct);
router.delete("/:id", auth, admin, ctrl.deleteProduct);
router.patch("/:id/remove-image", auth, admin, ctrl.removeImage);

module.exports = router;