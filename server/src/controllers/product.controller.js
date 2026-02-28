const Product = require("../models/Product");
const StockAlert = require("../models/StockAlert");
const { sendMail } = require("../config/mail");


function toBool(v) {
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return undefined;
}

function isAvailable(p) {
  const qty = Number(p?.stockQty || 0);
  return p?.inStock !== false && qty > 0;
}

async function notifyBackInStock(product) {
  const available = isAvailable(product);
  if (!available) return;

  const alerts = await StockAlert.find({
    productId: product._id,
    status: "pending",
  }).limit(500);

  if (!alerts.length) return;

  const subject = `${product.title} is back in stock`;
  const productUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/product/${product._id}`;

  for (const a of alerts) {
    try {
      await sendMail({
        to: a.email,
        subject,
        text: `${product.title} is back in stock. View: ${productUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>${product.title} is back in stock 🎉</h2>
            <p>Good news — the item you requested is available again.</p>
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
    return res.json(items);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    return res.json(item);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      description,
      images = [],
      sizes = [],
      colors = [],
      stockQty = 0,
      inStock = true,
    } = req.body || {};

    if (!title || price === undefined) {
      return res.status(400).json({ message: "title and price are required" });
    }

    const created = await Product.create({
      title: String(title).trim(),
      price: Number(price) || 0,
      category: category ? String(category).trim() : "General",
      description: description ? String(description) : "",
      images: Array.isArray(images) ? images : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
      stockQty: Number(stockQty) || 0,
      inStock: toBool(inStock) !== undefined ? toBool(inStock) : true,
    });

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

    const before = await Product.findById(id).select("inStock stockQty title");
    if (!before) return res.status(404).json({ message: "Product not found" });

    const wasAvailable = isAvailable(before);

    const update = {
      title: body.title !== undefined ? String(body.title).trim() : undefined,
      price: body.price !== undefined ? Number(body.price) : undefined,
      category: body.category !== undefined ? String(body.category).trim() : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      inStock: body.inStock !== undefined ? toBool(body.inStock) : undefined,
      stockQty: body.stockQty !== undefined ? Number(body.stockQty) : undefined,
      sizes: Array.isArray(body.sizes) ? body.sizes : undefined,
      colors: Array.isArray(body.colors) ? body.colors : undefined,
      images: Array.isArray(body.images) ? body.images : undefined, // optional if you want to allow updating images list
    };

    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

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
    return res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { publicId } = req.body || {};
    if (!publicId) return res.status(400).json({ message: "publicId is required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images = (product.images || []).filter((img) => img.publicId !== publicId);
    await product.save();

    return res.json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};