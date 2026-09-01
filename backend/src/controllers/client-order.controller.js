import {
    getMyOrders,
    getMyOrder,
} from "../services/client-order.service.js";


// ==========================================
// GET MY ORDERS
// ==========================================

const getOrders = async (req, res) => {
    try {

        const result = await getMyOrders(
            req.user.userId
        );

        if (
            result.error ===
            "CLIENT_NOT_FOUND"
        ) {
            return res.status(404).json({
                message:
                    "Client profile not found for this account",
                orders: [],
            });
        }

        return res.status(200).json({
            message:
                "Your orders fetched successfully",

            count: result.orders.length,

            orders: result.orders,
        });

    } catch (error) {

        console.error(
            "Client orders error:",
            error
        );

        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};


// ==========================================
// GET MY SINGLE ORDER
// ==========================================

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
            "CLIENT_NOT_FOUND"
        ) {
            return res.status(404).json({
                message:
                    "Client profile not found for this account",
            });
        }

        if (
            result.error ===
            "ORDER_NOT_FOUND"
        ) {
            return res.status(404).json({
                message:
                    "Order not found",
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
            message:
                "Internal server error",
        });
    }
};


export {
    getOrders,
    getSingleOrder,
};