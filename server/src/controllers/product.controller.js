const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

exports.listProducts = async (req, res) => {
  const { q, category } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (q) filter.title = { $regex: String(q), $options: "i" };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
};

exports.createProduct = async (req, res) => {
  try {
   const data = req.validated.body;
    const created = await Product.create(data);
    res.json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Invalid product data" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.validated.body;
    const updated = await Product.findByIdAndUpdate(req.params.id, req.validated.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Invalid update data" });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });

  const publicIds = (product.images || []).map((img) => img.publicId).filter(Boolean);

  if (publicIds.length) {
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (e) {
      console.error("Cloudinary delete error:", e?.message || e);
    }
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.removeProductImage = async (req, res) => {
  const { publicId } = req.validated.body;
  if (!publicId) return res.status(400).json({ message: "publicId required" });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });

  product.images = (product.images || []).filter((img) => img.publicId !== publicId);
  await product.save();

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.error("Cloudinary destroy error:", e?.message || e);
  }

  res.json(product);
};