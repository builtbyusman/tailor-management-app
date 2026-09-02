import Client from "../models/Client.js";
import Order from "../models/Order.js";

// ==========================================
// GET MY ORDERS - CLIENT
// ==========================================

const getMyOrders = async (userId) => {
    // ==========================================
    // STEP 1
    // Logged-in User se Client profile find karo
    // ==========================================

    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
            orders: [],
        };
    }

    // ==========================================
    // STEP 2
    // Client._id ke against orders find karo
    // ==========================================

    const orders = await Order.find({
        client: client._id,
    })
        .populate(
            "client",
            "name phone email address gender"
        )
        .populate(
            "tailor",
            "name email"
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

const getMyOrder = async (
    orderId,
    userId
) => {
    // ==========================================
    // STEP 1
    // Logged-in User → Client
    // ==========================================

    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    // ==========================================
    // STEP 2
    // Order must belong to this Client
    // ==========================================

    const order = await Order.findOne({
        _id: orderId,
        client: client._id,
    })
        .populate(
            "client",
            "name phone email address gender"
        )
        .populate(
            "tailor",
            "name email"
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
// EXPORTS
// ==========================================

export {
    getMyOrders,
    getMyOrder,
};