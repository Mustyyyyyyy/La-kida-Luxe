const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary"); 

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

    const update = {
      title: body.title,
      price: Number(body.price) || 0,
      category: body.category || "",
      description: body.description || "",
      inStock: body.inStock !== false,
      stockQty: typeof body.stockQty === "number" ? body.stockQty : Number(body.stockQty) || 0,
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
    };

    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
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