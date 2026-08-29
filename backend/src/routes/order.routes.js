import express from "express";

import {
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
} from "../controllers/order.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

// ==========================================
// CLIENT SELF-SERVICE ROUTES
// ==========================================

// Get logged-in client's orders
router.get(
    "/my",
    protect,
    authorize("CLIENT"),
    getMy
);

// Get logged-in client's single order
router.get(
    "/my/:orderId",
    protect,
    authorize("CLIENT"),
    getMySingle
);

// ==========================================
// TAILOR ROUTES
// ==========================================

// Create order for a client
// Advance payment is handled during order creation
router.post(
    "/:clientId",
    protect,
    authorize("TAILOR"),
    create
);

// Get all tailor orders
router.get(
    "/",
    protect,
    authorize("TAILOR"),
    getAll
);

// Recent orders
router.get(
    "/recent",
    protect,
    authorize("TAILOR"),
    getRecent
);

// Pending / in-progress orders
router.get(
    "/pending",
    protect,
    authorize("TAILOR"),
    getPending
);

// Ready orders
router.get(
    "/ready",
    protect,
    authorize("TAILOR"),
    getReady
);

// Order summary
router.get(
    "/summary",
    protect,
    authorize("TAILOR"),
    getSummary
);

// Update order status
router.patch(
    "/:orderId/status",
    protect,
    authorize("TAILOR"),
    updateStatus
);

// Get single order
router.get(
    "/:orderId",
    protect,
    authorize("TAILOR"),
    getSingle
);

router.get(
    "/client/:clientId",
    protect,
    authorize("TAILOR"),
    getClientOrders
);

// Update order
router.put(
    "/:orderId",
    protect,
    authorize("TAILOR"),
    update
);

// Delete order
router.delete(
    "/:orderId",
    protect,
    authorize("TAILOR"),
    remove
);

export default router;