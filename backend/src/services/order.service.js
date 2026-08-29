import mongoose from "mongoose";

import Order from "../models/Order.js";
import Client from "../models/Client.js";
import Payment from "../models/Payment.js";

// ==========================================
// CREATE ORDER - TAILOR
// OPTION A:
// If advanceAmount > 0, create Payment transaction too
// ==========================================

const createOrder = async (
    clientId,
    tailorId,
    orderData
) => {
    const client = await Client.findOne({
        _id: clientId,
        tailor: tailorId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const {
        clothingType,
        fabric,
        quantity,
        totalAmount,
        advanceAmount = 0,
        status,
        deliveryDate,
        notes,
    } = orderData;

    // Validate total amount
    if (
        totalAmount === undefined ||
        totalAmount === null ||
        totalAmount < 0
    ) {
        return {
            error: "INVALID_TOTAL_AMOUNT",
        };
    }

    // Validate advance amount
    if (advanceAmount < 0) {
        return {
            error: "INVALID_ADVANCE",
        };
    }

    // Advance cannot exceed total
    if (advanceAmount > totalAmount) {
        return {
            error: "INVALID_ADVANCE",
        };
    }

    const remainingAmount =
        totalAmount - advanceAmount;

    // ==========================================
    // DATABASE TRANSACTION
    // Order + Payment created together
    // ==========================================

    const session =
        await mongoose.startSession();

    try {
        let createdOrder;
        let createdPayment = null;

        await session.withTransaction(
            async () => {
                // Create Order
                const orders =
                    await Order.create(
                        [
                            {
                                client: clientId,
                                tailor: tailorId,
                                clothingType,
                                fabric,
                                quantity,
                                totalAmount,
                                advanceAmount,
                                remainingAmount,
                                status,
                                deliveryDate,
                                notes,
                            },
                        ],
                        {
                            session,
                        }
                    );

                createdOrder = orders[0];

                // ==========================================
                // CREATE INITIAL PAYMENT TRANSACTION
                // Only when advanceAmount > 0
                // ==========================================

                if (advanceAmount > 0) {
                    const payments =
                        await Payment.create(
                            [
                                {
                                    order:
                                        createdOrder._id,

                                    client:
                                        client._id,

                                    tailor:
                                        tailorId,

                                    amount:
                                        advanceAmount,

                                    paymentMethod:
                                        "CASH",

                                    notes:
                                        "Initial advance payment",
                                },
                            ],
                            {
                                session,
                            }
                        );

                    createdPayment =
                        payments[0];
                }
            }
        );

        return {
            order: createdOrder,
            payment: createdPayment,
        };
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
};

// ==========================================
// GET ALL ORDERS - TAILOR
// ==========================================

const getOrders = async (tailorId) => {
    const orders = await Order.find({
        tailor: tailorId,
    })
        .populate(
            "client",
            "name phone email"
        )
        .sort({
            createdAt: -1,
        });

    return orders;
};

// ==========================================
// GET SINGLE ORDER - TAILOR
// ==========================================

const getOrderById = async (
    orderId,
    tailorId
) => {
    const order = await Order.findOne({
        _id: orderId,
        tailor: tailorId,
    }).populate(
        "client",
        "name phone email address gender notes"
    );

    if (!order) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    return {
        order,
    };
};

// ==========================================
// UPDATE ORDER - TAILOR
// ==========================================

const updateOrder = async (
    orderId,
    tailorId,
    updateData
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

    const {
        clothingType,
        fabric,
        quantity,
        totalAmount,
        advanceAmount,
        status,
        deliveryDate,
        notes,
    } = updateData;

    if (clothingType !== undefined) {
        order.clothingType =
            clothingType;
    }

    if (fabric !== undefined) {
        order.fabric = fabric;
    }

    if (quantity !== undefined) {
        order.quantity = quantity;
    }

    if (totalAmount !== undefined) {
        if (totalAmount < 0) {
            return {
                error: "INVALID_TOTAL_AMOUNT",
            };
        }

        order.totalAmount =
            totalAmount;
    }

    if (advanceAmount !== undefined) {
        if (advanceAmount < 0) {
            return {
                error: "INVALID_ADVANCE",
            };
        }

        order.advanceAmount =
            advanceAmount;
    }

    if (status !== undefined) {
        order.status = status;
    }

    if (deliveryDate !== undefined) {
        order.deliveryDate =
            deliveryDate;
    }

    if (notes !== undefined) {
        order.notes = notes;
    }

    // ==========================================
    // RECALCULATE REMAINING AMOUNT
    // ==========================================

    const remainingAmount =
        order.totalAmount -
        order.advanceAmount;

    if (remainingAmount < 0) {
        return {
            error: "INVALID_ADVANCE",
        };
    }

    order.remainingAmount =
        remainingAmount;

    await order.save();

    return {
        order,
    };
};

// ==========================================
// DELETE ORDER - TAILOR
// ==========================================

const deleteOrder = async (
    orderId,
    tailorId
) => {
    const order =
        await Order.findOneAndDelete({
            _id: orderId,
            tailor: tailorId,
        });

    if (!order) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    // ==========================================
    // DELETE RELATED PAYMENTS
    // ==========================================

    await Payment.deleteMany({
        order: order._id,
        tailor: tailorId,
    });

    return {
        order,
    };
};

// ==========================================
// UPDATE ORDER STATUS - TAILOR
// ==========================================

const updateOrderStatus = async (
    orderId,
    tailorId,
    status
) => {
    const allowedStatuses = [
        "PENDING",
        "IN_PROGRESS",
        "READY",
        "DELIVERED",
    ];

    if (!allowedStatuses.includes(status)) {
        return {
            error: "INVALID_STATUS",
        };
    }

    const order = await Order.findOne({
        _id: orderId,
        tailor: tailorId,
    });

    if (!order) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    const validTransitions = {
        PENDING: ["IN_PROGRESS"],
        IN_PROGRESS: ["READY"],
        READY: ["DELIVERED"],
        DELIVERED: [],
    };

    if (
        !validTransitions[
            order.status
        ].includes(status)
    ) {
        return {
            error: "INVALID_TRANSITION",
        };
    }

    order.status = status;

    await order.save();

    return {
        order,
    };
};

// ==========================================
// GET RECENT ORDERS - TAILOR
// ==========================================

const getRecentOrders = async (
    tailorId
) => {
    const orders = await Order.find({
        tailor: tailorId,
    })
        .populate(
            "client",
            "name phone email"
        )
        .sort({
            createdAt: -1,
        })
        .limit(5);

    return orders;
};

// ==========================================
// GET PENDING ORDERS - TAILOR
// ==========================================

const getPendingOrders = async (
    tailorId
) => {
    const orders = await Order.find({
        tailor: tailorId,
        status: {
            $in: [
                "PENDING",
                "IN_PROGRESS",
            ],
        },
    })
        .populate(
            "client",
            "name phone email"
        )
        .sort({
            createdAt: -1,
        });

    return orders;
};

// ==========================================
// GET READY ORDERS - TAILOR
// ==========================================

const getReadyOrders = async (
    tailorId
) => {
    const orders = await Order.find({
        tailor: tailorId,
        status: "READY",
    })
        .populate(
            "client",
            "name phone email"
        )
        .sort({
            createdAt: -1,
        });

    return orders;
};

// ==========================================
// GET ORDER SUMMARY - TAILOR
// ==========================================

const getOrderSummary = async (
    tailorId
) => {
    const summary =
        await Order.aggregate([
            {
                $match: {
                    tailor:
                        new mongoose.Types.ObjectId(
                            tailorId
                        ),
                },
            },

            {
                $group: {
                    _id: null,

                    totalOrders: {
                        $sum: 1,
                    },

                    totalRevenue: {
                        $sum: "$totalAmount",
                    },

                    totalAdvance: {
                        $sum: "$advanceAmount",
                    },

                    totalRemaining: {
                        $sum: "$remainingAmount",
                    },

                    deliveredOrders: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "DELIVERED",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    pendingOrders: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$status",
                                        [
                                            "PENDING",
                                            "IN_PROGRESS",
                                        ],
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    readyOrders: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "READY",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    totalOrders: 1,
                    totalRevenue: 1,
                    totalAdvance: 1,
                    totalRemaining: 1,
                    deliveredOrders: 1,
                    pendingOrders: 1,
                    readyOrders: 1,
                },
            },
        ]);

    return (
        summary[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            totalAdvance: 0,
            totalRemaining: 0,
            deliveredOrders: 0,
            pendingOrders: 0,
            readyOrders: 0,
        }
    );
};

// ==========================================
// GET MY ORDERS - CLIENT
// ==========================================

const getMyOrders = async (
    userId
) => {
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
    })
        .populate(
            "client",
            "name phone email"
        )
        .sort({
            createdAt: -1,
        });

    return {
        orders,
    };
};

// ==========================================
// GET MY SINGLE ORDER - CLIENT
// ==========================================


// ==========================================
// GET ORDERS BY CLIENT - TAILOR
// ==========================================

const getOrdersByClient = async (
    clientId,
    tailorId
) => {
    const client = await Client.findOne({
        _id: clientId,
        tailor: tailorId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const orders = await Order.find({
        client: clientId,
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
        orders,
    };
};


const getMyOrderById = async (
    userId,
    orderId
) => {
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const order = await Order.findOne({
        _id: orderId,
        client: client._id,
    }).populate(
        "client",
        "name phone email"
    );

    if (!order) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    return {
        order,
    };
};

export {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getRecentOrders,
    getPendingOrders,
    getReadyOrders,
    getOrderSummary,
    getMyOrders,
    getMyOrderById,
    getOrdersByClient,
};