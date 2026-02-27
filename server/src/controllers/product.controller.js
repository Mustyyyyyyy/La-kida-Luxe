const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary"); 
const StockAlert = require("../models/StockAlert");
const { sendMail } = require("../config/mail");

function isAvailable(p) {
  return p && p.inStock !== false && (Number(p.stockQty) || 0) > 0;
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
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ message: "title and price are required" });
    }

    const created = await Product.create({
      title,
      price: Number(price),
      category: category || "General",
      description: description || "",
      images,
      sizes,
      colors,
      stockQty: Number(stockQty) || 0,
      inStock: Boolean(inStock),
    });

    res.json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};

    const before = await Product.findById(id);
    if (!before) return res.status(404).json({ message: "Product not found" });
    const wasAvailable = isAvailable(before);

    const update = {
      title: body.title,
      price: body.price !== undefined ? Number(body.price) : undefined,
      category: body.category,
      description: body.description,
      inStock: body.inStock !== undefined ? body.inStock !== false : undefined,
      stockQty:
        body.stockQty !== undefined
          ? typeof body.stockQty === "number"
            ? body.stockQty
            : Number(body.stockQty) || 0
          : undefined,
      sizes: Array.isArray(body.sizes) ? body.sizes : undefined,
      colors: Array.isArray(body.colors) ? body.colors : undefined,
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
    res.status(500).json({ message: "Could not update product" });
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