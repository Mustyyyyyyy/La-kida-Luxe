const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const MeasurementSchema = new mongoose.Schema(
  {
    chest: String,
    waist: String,
    hip: String,
    shoulder: String,
    sleeve: String,
    inseam: String,
    length: String,
    neck: String,
    notes: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, unique: true, index: true },

    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
    },

    delivery: {
      address: { type: String, required: true },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      method: { type: String, enum: ["standard", "express", "pickup"], default: "standard" },
    },

    items: { type: [OrderItemSchema], default: [] },

    // Tailor/custom order support
    isCustom: { type: Boolean, default: false },
    custom: {
      styleType: { type: String, default: "" },
      fabric: { type: String, default: "" },
      measurements: { type: MeasurementSchema, default: {} },
      referenceImages: { type: [String], default: [] }, // can be Cloudinary URLs later
      specialInstructions: { type: String, default: "" },
    },

    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending_whatsapp", "confirmed", "in_progress", "ready", "delivered", "cancelled"],
      default: "pending_whatsapp",
    },

    payment: {
      method: { type: String, enum: ["whatsapp", "bank_transfer", "paystack", "cash"], default: "whatsapp" },
      paid: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);