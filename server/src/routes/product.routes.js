const router = require("express").Router();
const ctrl = require("../controllers/product.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { validate } = require("../middleware/validate");
const {
  createProductSchema,
  updateProductSchema,
  removeImageSchema,
} = require("../validators/product.zod");

router.get("/", ctrl.listProducts);
router.get("/:id", ctrl.getProduct);

router.post("/", auth, admin, validate(createProductSchema), ctrl.createProduct);
router.put("/:id", auth, admin, validate(updateProductSchema), ctrl.updateProduct);

router.delete("/:id", auth, admin, ctrl.deleteProduct);
router.patch("/:id/remove-image", auth, admin, validate(removeImageSchema), ctrl.removeProductImage);

module.exports = router;