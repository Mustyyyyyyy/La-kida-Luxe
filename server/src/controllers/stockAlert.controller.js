const StockAlert = require("../models/StockAlert");
const Product = require("../models/Product");
const User = require("../models/User");

function isAvailable(product) {
  return product?.inStock !== false && (Number(product?.stockQty) || 0) > 0;
}

exports.subscribe = async (req, res) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.productId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const product = await Product.findById(productId).select("title inStock stockQty");
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (isAvailable(product)) {
      return res.status(400).json({ message: "This product is already in stock." });
    }

    const user = await User.findById(userId).select("email");
    if (!user?.email) return res.status(400).json({ message: "User email required" });

    const email = String(user.email).trim().toLowerCase();

    
    const exists = await StockAlert.findOne({
      productId,
      userId,
      status: "pending",
    });

    if (exists) {
      return res.json({ message: "You are already on the notify list." });
    }

    await StockAlert.create({
      productId,
      userId,
      email,
      status: "pending",
    });

    return res.status(201).json({
      message: "Saved! We’ll email you when it’s back in stock.",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not subscribe to stock alert" });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.productId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId) return res.status(400).json({ message: "productId is required" });

    await StockAlert.updateMany(
      { productId, userId, status: "pending" },
      { status: "cancelled" }
    );

    return res.json({ message: "Removed from notify list." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not unsubscribe" });
  }
};