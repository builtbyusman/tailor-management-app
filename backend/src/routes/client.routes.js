import express from "express";

import {
    create,
    getAll,
    getSingle,
    update,
    remove,
} from "../controllers/client.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

// ==========================================
// TAILOR ROUTES
// ==========================================

// Create client
router.post(
    "/",
    protect,
    authorize("TAILOR"),
    create
);

// Get all clients of logged-in tailor
router.get(
    "/",
    protect,
    authorize("TAILOR"),
    getAll
);

// Get single client
router.get(
    "/:id",
    protect,
    authorize("TAILOR"),
    getSingle
);

// Update client
router.put(
    "/:id",
    protect,
    authorize("TAILOR"),
    update
);

// Delete client
router.delete(
    "/:id",
    protect,
    authorize("TAILOR"),
    remove
);

export default router;