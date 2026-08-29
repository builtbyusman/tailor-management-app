import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getRecentOrders,
    getPendingOrders,
    getReadyOrders,
    getOrderSummary,
    getMyOrders,
    getMyOrderById,
    getOrdersByClient,
} from "../services/order.service.js";

// ==========================================
// CREATE ORDER - TAILOR
// ==========================================

const create = async (req, res) => {
    try {
        const { clientId } = req.params;

        const {
            clothingType,
            fabric,
            quantity,
            totalAmount,
            advanceAmount = 0,
            status,
            deliveryDate,
            notes,
        } = req.body;

        if (!clothingType) {
            return res.status(400).json({
                message: "Clothing type is required",
            });
        }

        if (totalAmount === undefined) {
            return res.status(400).json({
                message: "Total amount is required",
            });
        }

        if (Number(totalAmount) <= 0) {
            return res.status(400).json({
                message: "Total amount must be greater than 0",
            });
        }

        if (Number(advanceAmount) < 0) {
            return res.status(400).json({
                message: "Advance amount cannot be negative",
            });
        }

        const orderData = {
            clothingType,
            fabric,
            quantity,
            totalAmount: Number(totalAmount),
            advanceAmount: Number(advanceAmount),
            status,
            deliveryDate,
            notes,
        };

        const result = await createOrder(
            clientId,
            req.user.userId,
            orderData
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        if (result.error === "INVALID_ADVANCE") {
            return res.status(400).json({
                message:
                    "Advance amount cannot be greater than total amount",
            });
        }

        return res.status(201).json({
            message: "Order created successfully",
            order: result.order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET ALL ORDERS - TAILOR
// ==========================================

const getAll = async (req, res) => {
    try {
        const orders = await getOrders(req.user.userId);

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET SINGLE ORDER - TAILOR
// ==========================================

const getSingle = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await getOrderById(
            orderId,
            req.user.userId
        );

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            order: result.order,
        });
    } catch (error) {
        console.error("Get order error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// UPDATE ORDER - TAILOR
// ==========================================

const update = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await updateOrder(
            orderId,
            req.user.userId,
            req.body
        );

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (result.error === "INVALID_ADVANCE") {
            return res.status(400).json({
                message:
                    "Advance amount cannot be greater than total amount",
            });
        }

        return res.status(200).json({
            message: "Order updated successfully",
            order: result.order,
        });
    } catch (error) {
        console.error("Update order error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// DELETE ORDER - TAILOR
// ==========================================

const remove = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await deleteOrder(
            orderId,
            req.user.userId
        );

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error("Delete order error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// UPDATE ORDER STATUS - TAILOR
// ==========================================

const updateStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
            });
        }

        const result = await updateOrderStatus(
            orderId,
            req.user.userId,
            status
        );

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (result.error === "INVALID_STATUS") {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        if (result.error === "INVALID_TRANSITION") {
            return res.status(400).json({
                message: "Invalid order status transition",
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order: result.order,
        });
    } catch (error) {
        console.error("Update order status error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// RECENT ORDERS - TAILOR
// ==========================================

const getRecent = async (req, res) => {
    try {
        const orders = await getRecentOrders(
            req.user.userId
        );

        return res.status(200).json({
            message: "Recent orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("Recent orders error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// PENDING ORDERS - TAILOR
// ==========================================

const getPending = async (req, res) => {
    try {
        const orders = await getPendingOrders(
            req.user.userId
        );

        return res.status(200).json({
            message: "Pending orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("Pending orders error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// READY ORDERS - TAILOR
// ==========================================

const getReady = async (req, res) => {
    try {
        const orders = await getReadyOrders(
            req.user.userId
        );

        return res.status(200).json({
            message: "Ready orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("Ready orders error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// ORDER SUMMARY - TAILOR
// ==========================================

const getSummary = async (req, res) => {
    try {
        const summary = await getOrderSummary(
            req.user.userId
        );

        return res.status(200).json({
            message: "Order summary fetched successfully",
            summary,
        });
    } catch (error) {
        console.error("Order summary error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET MY ORDERS - CLIENT
// ==========================================

const getMy = async (req, res) => {
    try {
        const result = await getMyOrders(
            req.user.userId
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        return res.status(200).json({
            message: "Your orders fetched successfully",
            orders: result.orders,
        });
    } catch (error) {
        console.error("Client orders error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET MY SINGLE ORDER - CLIENT
// ==========================================

const getMySingle = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await getMyOrderById(
            req.user.userId,
            orderId
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message: "Your order fetched successfully",
            order: result.order,
        });
    } catch (error) {
        console.error("Client single order error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getClientOrders = async (req, res) => {
    try {
        const { clientId } = req.params;

        const result = await getOrdersByClient(
            clientId,
            req.user.userId
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        return res.status(200).json({
            message:
                "Client orders fetched successfully",

            orders: result.orders,
        });

    } catch (error) {
        console.error(
            "Get client orders error:",
            error
        );

        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

export {
    create,
    getAll,
    getSingle,
    update,
    remove,
    updateStatus,
    getRecent,
    getPending,
    getReady,
    getSummary,
    getMy,
    getMySingle,
    getClientOrders,
};