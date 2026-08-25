import mongoose from "mongoose";
import Order from "../models/Order.js";

const getDashboardData = async (tailorId) => {
    const tailorObjectId = new mongoose.Types.ObjectId(tailorId);

    const [summary, recentOrders, pendingOrders, readyOrders] =
        await Promise.all([
            // Summary
            Order.aggregate([
                {
                    $match: {
                        tailor: tailorObjectId,
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
            ]),

            // Recent Orders
            Order.find({
                tailor: tailorObjectId,
            })
                .populate("client", "name phone email")
                .sort({ createdAt: -1 })
                .limit(5),

            // Pending + In Progress
            Order.find({
                tailor: tailorObjectId,
                status: {
                    $in: ["PENDING", "IN_PROGRESS"],
                },
            })
                .populate("client", "name phone email")
                .sort({ createdAt: -1 }),

            // Ready Orders
            Order.find({
                tailor: tailorObjectId,
                status: "READY",
            })
                .populate("client", "name phone email")
                .sort({ createdAt: -1 }),
        ]);

    return {
        summary: summary[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            totalAdvance: 0,
            totalRemaining: 0,
            deliveredOrders: 0,
            pendingOrders: 0,
            readyOrders: 0,
        },

        recentOrders,
        pendingOrders,
        readyOrders,
    };
};

export default getDashboardData;