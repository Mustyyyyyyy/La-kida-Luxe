const mongoose = require("mongoose");

const ProductImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "General" }, // Kaftan, Gown, Agbada...
    price: { type: Number, required: true },
    description: { type: String, default: "" },

    images: { type: [ProductImageSchema], default: [] },

    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },

    inStock: { type: Boolean, default: true },
    stockQty: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);