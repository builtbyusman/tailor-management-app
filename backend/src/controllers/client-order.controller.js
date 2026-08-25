import {
    getMyOrders,
    getMyOrder,
} from "../services/client-order.service.js";


// Get My Orders
const getOrders = async (req, res) => {
    try {
        const orders = await getMyOrders(
            req.user.userId
        );

        return res.status(200).json({
            message:
                "Your orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error(
            "Client orders error:",
            error
        );

        return res.status(500).json({
            message: error.message,
        });
    }
};


// Get My Single Order
const getSingleOrder = async (
    req,
    res
) => {
    try {
        const { orderId } = req.params;

        const result = await getMyOrder(
            orderId,
            req.user.userId
        );

        if (
            result.error ===
            "ORDER_NOT_FOUND"
        ) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message:
                "Your order fetched successfully",
            order: result.order,
        });
    } catch (error) {
        console.error(
            "Client single order error:",
            error
        );

        return res.status(500).json({
            message: error.message,
        });
    }
};

export {
    getOrders,
    getSingleOrder,
};