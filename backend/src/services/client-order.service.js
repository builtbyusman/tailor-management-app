import Order from "../models/Order.js";
import Client from "../models/Client.js";

// ==========================================
// GET LOGGED-IN CLIENT ORDERS
// ==========================================

const getMyOrders = async (userId) => {
    // req.user.userId is User._id
    // Order.client stores Client._id
    // So first find the Client profile
    const client = await Client.findOne({
        user: userId,
    });

    // Client profile does not exist
    if (!client) {
        return [];
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

    return orders;
};


// ==========================================
// GET SINGLE LOGGED-IN CLIENT ORDER
// ==========================================

const getMyOrder = async (
    orderId,
    userId
) => {
    // Find Client profile using logged-in User ID
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "ORDER_NOT_FOUND",
        };
    }

    // Find order belonging to this Client
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
    getMyOrders,
    getMyOrder,
};