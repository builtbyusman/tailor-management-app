import Order from "../models/Order.js";

const getMyOrders = async (clientId) => {
    const orders = await Order.find({
        client: clientId,
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

const getMyOrder = async (
    orderId,
    clientId
) => {
    const order = await Order.findOne({
        _id: orderId,
        client: clientId,
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