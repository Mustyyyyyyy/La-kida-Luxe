const Order = require("../models/Order");

function genOrderCode() {
  return "LK-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?.id; // comes from auth middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const body = req.body || {};
    const orderCode = genOrderCode();

    const order = await Order.create({
      ...body,
      orderCode,
      userId,
    });

    return res.status(201).json(order);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Could not create order" });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id orderCode status total createdAt");

    return res.json(orders);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Could not load orders" });
  }
};

// ✅ admin: list all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Could not load orders" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });
    return res.json(updated);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Could not update status" });
  }
};