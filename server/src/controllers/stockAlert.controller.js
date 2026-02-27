const StockAlert = require("../models/StockAlert");
const Product = require("../models/Product");
const User = require("../models/User");

exports.subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId).select("email fullName");
    if (!user?.email) return res.status(400).json({ message: "User email required" });

    const product = await Product.findById(productId).select("title inStock stockQty");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const available = product.inStock !== false && (Number(product.stockQty) || 0) > 0;
    if (available) {
      return res.status(400).json({ message: "This product is already in stock." });
    }

    const exists = await StockAlert.findOne({
      productId,
      userId,
      status: "pending",
    });

    if (exists) return res.json({ message: "You are already on the notify list." });

    await StockAlert.create({
      productId,
      userId,
      email: user.email.toLowerCase(),
      status: "pending",
    });

    res.json({ message: "Saved! We’ll email you when it’s back in stock." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not subscribe to stock alert" });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await StockAlert.updateMany(
      { productId, userId, status: "pending" },
      { status: "cancelled" }
    );

    res.json({ message: "Removed from notify list." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not unsubscribe" });
  }
};