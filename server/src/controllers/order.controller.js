const Order = require("../models/Order");
const Product = require("../models/Product");

function normQty(n) {
  const q = Number(n);
  return Number.isFinite(q) && q > 0 ? q : 1;
}

function genOrderCode() {
  return "LK-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body || {};

    delete body.stockDeducted;

    const orderCode = genOrderCode();

    const order = await Order.create({
      ...body,
      orderCode,
      userId,
      stockDeducted: false,
    });

    return res.status(201).json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not create order" });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const userId = req.user.id;
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
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const confirmingNow = status === "confirmed";

    if (confirmingNow && !order.stockDeducted) {
      for (const it of order.items || []) {
        const qty = normQty(it.qty);

        if (!it.productId) {
          return res.status(400).json({ message: `Missing productId for item: ${it.title}` });
        }

        let updated = await Product.findOneAndUpdate(
          { _id: it.productId, stockQty: { $gte: qty } },
          { $inc: { stockQty: -qty } },
          { new: true }
        );

        if (!updated) {
          updated = await Product.findOneAndUpdate(
            { _id: it.productId, stockqty: { $gte: qty } },
            { $inc: { stockqty: -qty } },
            { new: true }
          );
        }

        if (!updated) {
          const p = await Product.findById(it.productId);
          if (!p) return res.status(400).json({ message: `Product not found for item: ${it.title}` });

          const currentQty =
            typeof p.stockQty === "number" ? p.stockQty : Number(p.stockqty || 0);

          return res.status(400).json({
            message: `${p.title} does not have enough stock (${currentQty} left).`,
          });
        }

        const qtyLeft =
          typeof updated.stockQty === "number" ? updated.stockQty : Number(updated.stockqty || 0);

        const shouldBeInStock = qtyLeft > 0;

        updated.inStock = shouldBeInStock;
        updated.instock = shouldBeInStock;

        await updated.save();
      }

      order.stockDeducted = true;
    }

    order.status = status;
    await order.save();

    return res.json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not update status" });
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