const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ctrl = require("../controllers/upload.controller");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, 
});

router.post(
  "/product-images",
  auth,
  admin,
  upload.array("images", 12), 
  ctrl.uploadProductImages
);

module.exports = router;