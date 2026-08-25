import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },

        tailor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        clothingType: {
            type: String,
            required: true,
            trim: true,
        },

        fabric: {
            type: String,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        advanceAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        remainingAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "IN_PROGRESS",
                "READY",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PENDING",
        },

        deliveryDate: {
            type: Date,
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;