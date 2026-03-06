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
    title: { type: String, trim: true, default: "Untitled Product" },

    category: { type: String, default: "General" },

    price: { type: Number, default: 0 },

    description: { type: String, default: "" },

    images: { type: [ProductImageSchema], default: [] },

    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },

    inStock: { type: Boolean, default: true },

    stockQty: { type: Number, default: null },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  if (typeof this.stockQty === "number") {
    this.inStock = this.stockQty > 0;
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);