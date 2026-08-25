import express from "express";

import {
    getOrders,
    getSingleOrder,
} from "../controllers/client-order.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();


// Client → My Orders
router.get(
    "/",
    protect,
    authorize("CLIENT"),
    getOrders
);


// Client → Single My Order
router.get(
    "/:orderId",
    protect,
    authorize("CLIENT"),
    getSingleOrder
);

export default router;