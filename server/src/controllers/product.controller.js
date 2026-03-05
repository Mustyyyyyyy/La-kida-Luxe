const Product = require("../models/Product");
const StockAlert = require("../models/StockAlert");
const { sendMail } = require("../config/mail");

function isAvailable(product) {
  // ✅ if admin marks inStock true, it's available even if stockQty is 0/undefined
  if (!product) return false;
  if (product.inStock === false) return false;
  if (product.inStock === true) return true;

  // fallback: if inStock isn't set, use stockQty if present
  const qty = Number(product.stockQty);
  if (Number.isFinite(qty)) return qty > 0;
  return true;
}

async function notifyBackInStock(product) {
  const available = isAvailable(product);
  if (!available) return;

  const alerts = await StockAlert.find({
    productId: product._id,
    status: "pending",
  }).limit(500);

  if (!alerts.length) return;

  const subject = `${product.title} is back in stock 🎉`;
  const productUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/product/${product._id}`;

  for (const a of alerts) {
    try {
      await sendMail({
        to: a.email,
        subject,
        text: `${product.title} is back in stock. View: ${productUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>${product.title} is back in stock 🎉</h2>
            <p>Good news — the item you asked for is available again.</p>
            <p><a href="${productUrl}">View product</a></p>
            <p style="color:#666;font-size:12px;">If you didn’t request this, you can ignore this email.</p>
          </div>
        `,
      });

      a.status = "sent";
      await a.save();
    } catch (e) {
      console.error("Stock alert send failed:", a.email, e?.message);
    }
  }
}

exports.getProducts = async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const body = req.body || {};

    // ✅ do NOT force stockQty=0 if not provided
    const doc = {
      title: String(body.title || "").trim() || "Untitled Product",
      price: body.price === undefined ? 0 : Number(body.price) || 0,
      category: String(body.category || "").trim() || "General",
      description: String(body.description || "").trim() || "",
      images: Array.isArray(body.images) ? body.images : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      inStock: body.inStock === undefined ? true : Boolean(body.inStock),
    };

    // only add stockQty if admin supplied it
    if (body.stockQty !== undefined && body.stockQty !== "") {
      doc.stockQty = Number(body.stockQty) || 0;
    }

    const created = await Product.create(doc);
    return res.json(created);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};

    const before = await Product.findById(id);
    if (!before) return res.status(404).json({ message: "Product not found" });
    const wasAvailable = isAvailable(before);

    const update = {};

    if (body.title !== undefined) update.title = String(body.title || "").trim() || "Untitled Product";
    if (body.price !== undefined) update.price = Number(body.price) || 0;
    if (body.category !== undefined) update.category = String(body.category || "").trim() || "General";
    if (body.description !== undefined) update.description = String(body.description || "").trim() || "";
    if (body.inStock !== undefined) update.inStock = body.inStock !== false;

    // ✅ only set stockQty if admin sends it
    if (body.stockQty !== undefined && body.stockQty !== "") {
      update.stockQty = typeof body.stockQty === "number" ? body.stockQty : Number(body.stockQty) || 0;
    }

    if (Array.isArray(body.sizes)) update.sizes = body.sizes;
    if (Array.isArray(body.colors)) update.colors = body.colors;

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const nowAvailable = isAvailable(product);
    if (!wasAvailable && nowAvailable) {
      notifyBackInStock(product).catch((e) =>
        console.error("notifyBackInStock error:", e?.message)
      );
    }

    return res.json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "publicId is required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images = (product.images || []).filter((img) => img.publicId !== publicId);
    await product.save();

    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};