import Client from "../models/Client.js";
import Order from "../models/Order.js";

// ==========================================
// GET MY ORDERS - CLIENT
// ==========================================

const getMyOrders = async (userId) => {
    // Logged-in User ko Client profile se find karo
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
            orders: [],
        };
    }

    // IMPORTANT:
    // Order.client = Client._id
    // NOT User._id
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
    // First find Client profile
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    // Then find order belonging to that Client
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


export {
    getMyOrders,
    getMyOrder,
};