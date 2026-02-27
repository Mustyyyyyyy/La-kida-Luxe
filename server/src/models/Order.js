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
    orderCode: { type: String, required: true, unique: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    customer: {
      fullName: String,
      phone: String,
      email: String,
    },

    delivery: {
      method: { type: String, default: "delivery" },
      address: String,
      city: String,
      state: String,
      note: String,
    },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        price: Number,
        qty: Number,
        size: String,
        color: String,
      },
    ],

    subtotal: Number,
    deliveryFee: Number,
    total: Number,

    status: {
      type: String,
      enum: ["pending_whatsapp", "confirmed", "in_progress", "ready", "delivered", "cancelled"],
      default: "pending_whatsapp",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", OrderSchema);