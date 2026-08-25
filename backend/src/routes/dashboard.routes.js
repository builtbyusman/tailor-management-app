import express from "express";

import {
    getDashboard,
} from "../controllers/dashboard.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
    "/",
    protect,
    authorize("TAILOR"),
    getDashboard
);

export default router;