import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Client from "../models/Client.js";

// ==========================================
// CREATE PAYMENT - TAILOR
// ==========================================

const createPayment = async (
    orderId,
    tailorId,
    amount,
    paymentMethod,
    notes
) => {
    const order = await Order.findOne({
        _id: orderId,
        tailor: tailorId,
    });

    if (!order) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    if (!amount || amount <= 0) {
        return {
            error: "INVALID_PAYMENT",
        };
    }

    if (amount > order.remainingAmount) {
        return {
            error: "PAYMENT_EXCEEDS_REMAINING",
        };
    }

    const payment = await Payment.create({
        order: order._id,
        client: order.client,
        tailor: order.tailor,
        amount,
        paymentMethod,
        notes,
    });

    order.advanceAmount += amount;

    order.remainingAmount =
        order.totalAmount - order.advanceAmount;

    await order.save();

    return {
        payment,
        order,
    };
};

// ==========================================
// GET PAYMENT HISTORY - TAILOR
// ==========================================

const getPaymentHistory = async (
    orderId,
    tailorId
) => {
    const order = await Order.findOne({
        _id: orderId,
        tailor: tailorId,
    });

    if (!order) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    const payments = await Payment.find({
        order: orderId,
        tailor: tailorId,
    })
        .populate(
            "client",
            "name phone email"
        )
        .sort({
            createdAt: -1,
        });

    return {
        payments,
    };
};

// ==========================================
// GET PAYMENT SUMMARY - TAILOR
// ==========================================

const getPaymentSummary = async (
    orderId,
    tailorId
) => {
    const order = await Order.findOne({
        _id: orderId,
        tailor: tailorId,
    });

    if (!order) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    const result = await Payment.aggregate([
        {
            $match: {
                order: new mongoose.Types.ObjectId(
                    orderId
                ),

                tailor: new mongoose.Types.ObjectId(
                    tailorId
                ),
            },
        },

        {
            $group: {
                _id: null,

                totalPaid: {
                    $sum: "$amount",
                },

                paymentCount: {
                    $sum: 1,
                },
            },
        },
    ]);

    const transactionPaid =
        result.length > 0
            ? result[0].totalPaid
            : 0;

    const paymentCount =
        result.length > 0
            ? result[0].paymentCount
            : 0;

    return {
        summary: {
            totalAmount: order.totalAmount,
            orderPaid: order.advanceAmount,
            transactionPaid,
            remainingAmount: order.remainingAmount,
            paymentCount,
        },
    };
};

// ==========================================
// GET MY PAYMENTS - CLIENT
// ==========================================

const getMyPayments = async (userId) => {
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const payments = await Payment.find({
        client: client._id,
    })
        .populate(
            "order",
            "clothingType fabric quantity totalAmount advanceAmount remainingAmount status deliveryDate"
        )
        .sort({
            createdAt: -1,
        });

    return {
        payments,
    };
};

// ==========================================
// GET MY PAYMENT SUMMARY - CLIENT
// ==========================================

const getMyPaymentSummary = async (userId) => {
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const orders = await Order.find({
        client: client._id,
    });

    const payments = await Payment.find({
        client: client._id,
    });

    const totalAmount = orders.reduce(
        (total, order) => {
            return total + (order.totalAmount || 0);
        },
        0
    );

    const totalPaid = payments.reduce(
        (total, payment) => {
            return total + (payment.amount || 0);
        },
        0
    );

    const remainingAmount = Math.max(
        totalAmount - totalPaid,
        0
    );

    return {
        summary: {
            totalAmount,
            totalPaid,
            remainingAmount,
            paymentCount: payments.length,
        },
    };
};

export {
    createPayment,
    getPaymentHistory,
    getPaymentSummary,
    getMyPayments,
    getMyPaymentSummary,
};