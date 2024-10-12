import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalOrderPrice: Number,
    discount: Number,
    totalOrderAfterDiscount: Number,
    paymentMethod: {
      type: String,
      enums: ["cache", "credit"],
      default: "cache",
        },
        shippingAddress: {
            city: String,
            street:String,
            phone:String
        },
        isPaid: Boolean,
        paidAt: Date,
        isDelivered: Boolean,
        
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
