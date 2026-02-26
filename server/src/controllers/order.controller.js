const Order = require("../models/Order");
const { makeOrderCode } = require("../utils/makeOrderCode");

exports.createOrder = async (req, res) => {
  try {
    const payload = req.validated.body;

    if (!payload?.customer?.fullName || !payload?.customer?.phone) {
      return res.status(400).json({ message: "Customer name + phone required" });
    }
    if (!payload?.delivery?.address) {
      return res.status(400).json({ message: "Delivery address required" });
    }

    const hasItems = Array.isArray(payload.items) && payload.items.length > 0;
    if (!hasItems && !payload.isCustom) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      ...payload,
      orderCode: makeOrderCode(),
      status: "pending_whatsapp",
      payment: { method: "whatsapp", paid: false },
    });

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error creating order" });
  }
};

exports.listOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending_whatsapp", "confirmed", "in_progress", "ready", "delivered", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(updated);
};