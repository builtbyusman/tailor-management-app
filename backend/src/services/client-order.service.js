import Order from "../models/Order.js";
import Client from "../models/Client.js";


// ==========================================
// GET LOGGED-IN CLIENT PROFILE
// ==========================================

const getClientProfile = async (userId) => {

    const client = await Client.findOne({
        user: userId,
    });

    return client;
};


// ==========================================
// GET MY ORDERS
// ==========================================

const getMyOrders = async (userId) => {

    // Find Client using logged-in User
    const client = await getClientProfile(
        userId
    );

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
            orders: [],
        };
    }


    // Find orders using Client _id
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
// GET MY SINGLE ORDER
// ==========================================

const getMyOrder = async (
    orderId,
    userId
) => {

    // Find client profile
    const client = await getClientProfile(
        userId
    );

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }


    // Find order belonging to this client
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


// ==========================================
// EXPORTS
// ==========================================

export {
    getMyOrders,
    getMyOrder,
};