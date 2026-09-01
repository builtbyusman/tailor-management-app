import Order from "../models/Order.js";
import Client from "../models/Client.js";

const getMyOrders = async (userId) => {

    console.log("================================");
    console.log("CLIENT ORDERS DEBUG");
    console.log("Logged in User ID:", userId);

    // Find client profile
    const client = await Client.findOne({
        user: userId,
    });

    console.log("Client found:", client);

    if (!client) {
        console.log(
            "❌ NO CLIENT PROFILE FOR THIS USER"
        );

        return {
            error: "CLIENT_NOT_FOUND",
            orders: [],
        };
    }

    console.log(
        "✅ Client ID:",
        client._id.toString()
    );

    // Find orders
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

    console.log(
        "Orders found:",
        orders.length
    );

    console.log(
        "Orders:",
        orders
    );

    console.log("================================");

    return {
        orders,
    };
};


const getMyOrder = async (
    orderId,
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