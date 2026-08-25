import express from "express";

import {
    addPayment,
    getHistory,
    getSummary,
    getMy,
    getMySummary,
} from "../controllers/payment.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

// ==========================================
// CLIENT PAYMENT ROUTES
// ==========================================

// Get logged-in client's payment history
router.get(
    "/my",
    protect,
    authorize("CLIENT"),
    getMy
);

// Get logged-in client's payment summary
router.get(
    "/my/summary",
    protect,
    authorize("CLIENT"),
    getMySummary
);

// ==========================================
// TAILOR PAYMENT ROUTES
// ==========================================

// Add payment to an order
router.post(
    "/:orderId",
    protect,
    authorize("TAILOR"),
    addPayment
);

// Get payment summary for an order
router.get(
    "/:orderId/summary",
    protect,
    authorize("TAILOR"),
    getSummary
);

// Get payment history for an order
router.get(
    "/:orderId",
    protect,
    authorize("TAILOR"),
    getHistory
);

export default router;