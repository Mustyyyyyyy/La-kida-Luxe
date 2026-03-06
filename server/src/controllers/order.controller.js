const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

function normQty(n) {
  const q = Number(n);
  if (!Number.isFinite(q)) return 1;
  return Math.max(1, Math.floor(q));
}

function genOrderCode() {
  return "LK-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

const ALLOWED_STATUSES = new Set([
  "pending_whatsapp",
  "confirmed",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
]);

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return res.status(400).json({ message: "Order must include at least 1 item." });
    }

    const cleanedItems = items.map((it) => ({
      productId: it.productId,
      title: String(it.title || "").trim() || "Item",
      price: Number(it.price) || 0,
      qty: normQty(it.qty),
      size: String(it.size || ""),
      color: String(it.color || ""),
      image: String(it.image || ""),
    }));

    const subtotal =
      Number(body.subtotal) ||
      cleanedItems.reduce((sum, it) => sum + it.price * it.qty, 0);

    const deliveryFee = Number(body.deliveryFee) || 0;
    const total = Number(body.total) || subtotal + deliveryFee;

    const order = await Order.create({
      orderCode: genOrderCode(),
      userId,
      items: cleanedItems,
      subtotal,
      deliveryFee,
      total,
      status: "pending_whatsapp",
      stockDeducted: false,
      customer: body.customer || {},
      delivery: body.delivery || {},
      isCustom: Boolean(body.isCustom),
      custom: body.custom || {},
    });

    return res.status(201).json(order);
  } catch (e) {
    console.error(e);
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
    console.error(e);
    return res.status(500).json({ message: "Could not load orders" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not load orders" });
  }
};

exports.updateStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const status = String(req.body?.status || "").trim();
    if (!ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    session.startTransaction();

    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }

    const confirmingNow = status === "confirmed";

    if (confirmingNow && !order.stockDeducted) {
      for (const it of order.items || []) {
        const qty = normQty(it.qty);
        const productId = it.productId;

        if (!productId) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Missing productId for item: ${it.title}` });
        }

        const product = await Product.findById(productId).session(session);
        if (!product) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Product not found for item: ${it.title}` });
        }

        const currentQty = Number(product.stockQty ?? 0);

        if (typeof product.stockQty === "number") {
          if (currentQty < qty) {
            await session.abortTransaction();
            return res.status(400).json({
              message: `${product.title} does not have enough stock (${currentQty} left).`,
            });
          }

          const nextQty = currentQty - qty;
          product.stockQty = nextQty;
          product.inStock = nextQty > 0;
        } else {
          product.inStock = true;
        }

        await product.save({ session });
      }

      order.stockDeducted = true;
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    return res.json(order);
  } catch (e) {
    console.error(e);
    try {
      await session.abortTransaction();
    } catch {}
    return res.status(500).json({ message: "Could not update status" });
  } finally {
    session.endSession();
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not delete order" });
  }
};