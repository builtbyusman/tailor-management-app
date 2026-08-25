import express from "express";

import {
    create,
    getSingle,
    update,
    remove,
    getMy,
    updateMy,
} from "../controllers/measurement.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

// ==============================
// CLIENT SELF-SERVICE ROUTES
// ==============================

router.get(
    "/me",
    protect,
    authorize("CLIENT"),
    getMy
);

router.put(
    "/me",
    protect,
    authorize("CLIENT"),
    updateMy
);


// ==============================
// TAILOR ROUTES
// ==============================

router.post(
    "/:clientId",
    protect,
    authorize("TAILOR"),
    create
);

router.get(
    "/:clientId",
    protect,
    authorize("TAILOR"),
    getSingle
);

router.put(
    "/:clientId",
    protect,
    authorize("TAILOR"),
    update
);

router.delete(
    "/:clientId",
    protect,
    authorize("TAILOR"),
    remove
);

export default router;
