import {
    createPayment,
    getPaymentHistory,
    getPaymentSummary,
    getMyPayments,
    getMyPaymentSummary,
} from "../services/payment.service.js";

// ==========================================
// ADD PAYMENT - TAILOR
// ==========================================

const addPayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        const {
            amount,
            paymentMethod,
            notes,
        } = req.body;

        const result = await createPayment(
            orderId,
            req.user.userId,
            amount,
            paymentMethod,
            notes
        );

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (result.error === "INVALID_PAYMENT") {
            return res.status(400).json({
                message:
                    "Payment amount must be greater than 0",
            });
        }

        if (
            result.error ===
            "PAYMENT_EXCEEDS_REMAINING"
        ) {
            return res.status(400).json({
                message:
                    "Payment cannot be greater than remaining amount",
            });
        }

        return res.status(201).json({
            message: "Payment added successfully",
            payment: result.payment,
            order: result.order,
        });
    } catch (error) {
        console.error(
            "Add payment error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET PAYMENT HISTORY - TAILOR
// ==========================================

const getHistory = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await getPaymentHistory(
            orderId,
            req.user.userId
        );

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message:
                "Payment history fetched successfully",
            payments: result.payments,
        });
    } catch (error) {
        console.error(
            "Payment history error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET PAYMENT SUMMARY - TAILOR
// ==========================================

const getSummary = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await getPaymentSummary(
            orderId,
            req.user.userId
        );

        if (result.error === "ORDER_NOT_FOUND") {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message:
                "Payment summary fetched successfully",
            summary: result.summary,
        });
    } catch (error) {
        console.error(
            "Payment summary error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET MY PAYMENTS - CLIENT
// ==========================================

const getMy = async (req, res) => {
    try {
        const result = await getMyPayments(
            req.user.userId
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        return res.status(200).json({
            message:
                "Your payment history fetched successfully",
            payments: result.payments,
        });
    } catch (error) {
        console.error(
            "Client payment history error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// ==========================================
// GET MY PAYMENT SUMMARY - CLIENT
// ==========================================

const getMySummary = async (req, res) => {
    try {
        const result =
            await getMyPaymentSummary(
                req.user.userId
            );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        return res.status(200).json({
            message:
                "Your payment summary fetched successfully",
            summary: result.summary,
        });
    } catch (error) {
        console.error(
            "Client payment summary error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export {
    addPayment,
    getHistory,
    getSummary,
    getMy,
    getMySummary,
};