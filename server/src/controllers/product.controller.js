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
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    // optional: delete cloudinary images
    // if you store publicId and have cloudinary config:
    // for (const img of deleted.images || []) {
    //   if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    // }

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