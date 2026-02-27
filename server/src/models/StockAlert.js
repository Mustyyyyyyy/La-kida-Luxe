const mongoose = require("mongoose");

const StockAlertSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ["pending", "sent", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

StockAlertSchema.index({ productId: 1, userId: 1, status: 1 });

module.exports = mongoose.model("StockAlert", StockAlertSchema);