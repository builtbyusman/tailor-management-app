import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import clientRoutes from "./routes/client.routes.js";
import measurementRoutes from "./routes/measurement.routes.js";
import orderRoutes from "./routes/order.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import clientOrderRoutes from "./routes/client-order.routes.js";

import protect from "./middlewares/auth.middleware.js";
import authorize from "./middlewares/role.middleware.js";

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://tailor-management-app-pearl.vercel.app",
        ],
        credentials: true,
    })
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.json({
        message:
            "Tailoring Management API is running",
    });
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    authRoutes
);

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

app.get(
    "/api/profile",
    protect,
    (req, res) => {
        res.json({
            message:
                "You are authenticated",
            user: req.user,
        });
    }
);

/*
|--------------------------------------------------------------------------
| Tailor Dashboard Welcome
|--------------------------------------------------------------------------
*/

app.get(
    "/api/tailor/dashboard",
    protect,
    authorize("TAILOR"),
    (req, res) => {
        res.json({
            message:
                "Welcome to Tailor Dashboard",
            user: req.user,
        });
    }
);

/*
|--------------------------------------------------------------------------
| Clients
|--------------------------------------------------------------------------
*/

app.use(
    "/api/clients",
    clientRoutes
);

/*
|--------------------------------------------------------------------------
| Measurements
|--------------------------------------------------------------------------
*/

app.use(
    "/api/measurements",
    measurementRoutes
);

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/

app.use(
    "/api/orders",
    orderRoutes
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

app.use(
    "/api/dashboard",
    dashboardRoutes
);

/*
|--------------------------------------------------------------------------
| Payments
|--------------------------------------------------------------------------
*/

app.use(
    "/api/payments",
    paymentRoutes
);

/*
|--------------------------------------------------------------------------
| Client Orders
|--------------------------------------------------------------------------
*/

app.use(
    "/api/client-orders",
    clientOrderRoutes
);

export default app;