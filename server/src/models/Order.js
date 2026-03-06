const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
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

const CustomSchema = new mongoose.Schema(
  {
    styleType: { type: String, default: "" },
    fabric: { type: String, default: "" },
    specialInstructions: { type: String, default: "" },
    measurements: { type: MeasurementSchema, default: {} },
    referenceImages: { type: [String], default: [] },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, default: "" },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: { type: [OrderItemSchema], default: [] },

    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending_whatsapp", "confirmed", "in_progress", "ready", "delivered", "cancelled"],
      default: "pending_whatsapp",
    },

    stockDeducted: { type: Boolean, default: false },

    customer: { type: Object, default: {} },
    delivery: { type: Object, default: {} },

    isCustom: { type: Boolean, default: false },
    custom: { type: CustomSchema, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);