const Order = require("../models/Order");

function makeOrderCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `LK-${n}`;
}

exports.createOrder = async (req, res) => {
  try {
    const { customer, delivery, items, subtotal, deliveryFee, total } = req.body;

    if (!customer?.fullName || !customer?.phone) {
      return res.status(400).json({ message: "Customer fullName and phone are required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const order = await Order.create({
      orderCode: makeOrderCode(),
      customer,
      delivery: delivery || {},
      items,
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      total: Number(total) || 0,
      status: "pending_whatsapp",
    });

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending_whatsapp", "confirmed", "in_progress", "ready", "delivered", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};