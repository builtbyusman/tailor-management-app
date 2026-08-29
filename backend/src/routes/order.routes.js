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


// ==========================================
// GET ALL TAILOR ORDERS
// ==========================================

router.get(
  "/",
  protect,
  authorize("TAILOR"),
  getAll
);


// ==========================================
// GET RECENT ORDERS
// ==========================================

router.get(
  "/recent",
  protect,
  authorize("TAILOR"),
  getRecent
);


// ==========================================
// GET PENDING / IN-PROGRESS ORDERS
// ==========================================

router.get(
  "/pending",
  protect,
  authorize("TAILOR"),
  getPending
);


// ==========================================
// GET READY ORDERS
// ==========================================

router.get(
  "/ready",
  protect,
  authorize("TAILOR"),
  getReady
);


// ==========================================
// GET ORDER SUMMARY
// ==========================================

router.get(
  "/summary",
  protect,
  authorize("TAILOR"),
  getSummary
);


// ==========================================
// GET ORDERS OF SELECTED CLIENT
// ==========================================

// Example:
// GET /api/orders/client/CLIENT_ID

router.get(
  "/client/:clientId",
  protect,
  authorize("TAILOR"),
  getClientOrders
);


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

// Example:
// PATCH /api/orders/ORDER_ID/status

router.patch(
  "/:orderId/status",
  protect,
  authorize("TAILOR"),
  updateStatus
);


// ==========================================
// GET SINGLE ORDER
// ==========================================

// Example:
// GET /api/orders/ORDER_ID

router.get(
  "/:orderId",
  protect,
  authorize("TAILOR"),
  getSingle
);


// ==========================================
// UPDATE ORDER
// ==========================================

// Example:
// PUT /api/orders/ORDER_ID

router.put(
  "/:orderId",
  protect,
  authorize("TAILOR"),
  update
);


// ==========================================
// DELETE ORDER
// ==========================================

// Example:
// DELETE /api/orders/ORDER_ID

router.delete(
  "/:orderId",
  protect,
  authorize("TAILOR"),
  remove
);


export default router;