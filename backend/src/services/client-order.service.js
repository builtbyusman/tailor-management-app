import Order from "../models/Order.js";
import Client from "../models/Client.js";

// ==========================================
// GET MY ORDERS - CLIENT
// ==========================================

const getMyOrders = async (userId) => {
    // ======================================
    // FIND CLIENT PROFILE USING USER ID
    // ======================================

    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
            orders: [],
        };
    }

    // ======================================
    // FIND ORDERS USING CLIENT._id
    // ======================================

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

const getMyOrder = async (
    orderId,
    userId
) => {

    // ======================================
    // FIND CLIENT PROFILE
    // ======================================

    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    // ======================================
    // FIND ORDER
    // ======================================

    const order = await Order.findOne({
        _id: orderId,
        client: client._id,
    })
        .populate(
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
    getMyOrders,
    getMyOrder,
};