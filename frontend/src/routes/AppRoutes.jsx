import { Routes, Route, Navigate } from "react-router-dom";

// ==============================
// AUTH
// ==============================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ==============================
// TAILOR PAGES
// ==============================
import TailorDashboard from "../pages/tailor/Dashboard";
import Clients from "../pages/tailor/Clients";
import AddClient from "../pages/tailor/AddClient";
import ClientDetails from "../pages/tailor/ClientDetails";
import ClientMeasurements from "../pages/tailor/ClientMeasurements";
import TailorClientPayments from "../pages/tailor/ClientPayments";
import TailorPayments from "../pages/tailor/TailorPayments";

import AddOrder from "../pages/tailor/AddOrder";
import EditOrder from "../pages/tailor/EditOrder";
import Orders from "../pages/tailor/Orders";
import OrderDetails from "../pages/tailor/OrderDetails";
import OrderPayments from "../pages/tailor/OrderPayments";

// ==============================
// CLIENT PAGES
// ==============================
import ClientDashboard from "../pages/client/Dashboard";
import ClientOrders from "../pages/client/ClientOrders";
import ClientOrderDetails from "../pages/client/ClientOrderDetails";
import ClientPayments from "../pages/client/ClientPayments";

// ==============================
// LAYOUTS
// ==============================
import TailorLayout from "../layouts/TailorLayout";
import ClientLayout from "../layouts/ClientLayout";

// ==============================
// PROTECTED ROUTE
// ==============================
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =====================================================
          TAILOR ROUTES
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["TAILOR"]}>
            <TailorLayout />
          </ProtectedRoute>
        }
      >

        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/tailor/dashboard"
          element={<TailorDashboard />}
        />


        {/* =========================
            CLIENTS
        ========================= */}

        <Route
          path="/tailor/clients"
          element={<Clients />}
        />

        <Route
          path="/tailor/clients/add"
          element={<AddClient />}
        />

        <Route
          path="/tailor/clients/:id"
          element={<ClientDetails />}
        />

        <Route
          path="/tailor/clients/:id/edit"
          element={<AddClient />}
        />

        <Route
          path="/tailor/clients/:id/measurements"
          element={<ClientMeasurements />}
        />

        <Route
          path="/tailor/clients/:id/payments"
          element={<TailorClientPayments />}
        />


        {/* =========================
            ALL TAILOR PAYMENTS
        ========================= */}

        <Route
          path="/tailor/payments"
          element={<TailorPayments />}
        />


        {/* =========================
            ORDERS
        ========================= */}

        <Route
          path="/tailor/orders"
          element={<Orders />}
        />

        {/* IMPORTANT:
            AddOrder.jsx loads the client list itself.
            Therefore NO :clientId is required here.
        */}

        <Route
          path="/tailor/orders/add"
          element={<AddOrder />}
        />

        {/* Optional route if another existing page
            opens AddOrder with a client ID */}

        <Route
          path="/tailor/orders/add/:clientId"
          element={<AddOrder />}
        />

        {/* Edit Order */}

        <Route
          path="/tailor/orders/:id/edit"
          element={<EditOrder />}
        />

        {/* Order Details */}

        <Route
          path="/tailor/orders/:id"
          element={<OrderDetails />}
        />

        {/* Order Payments */}

        <Route
          path="/tailor/orders/:id/payments"
          element={<OrderPayments />}
        />

      </Route>


      {/* =====================================================
          CLIENT ROUTES
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >

        {/* =========================
            CLIENT DASHBOARD
        ========================= */}

        <Route
          path="/client/dashboard"
          element={<ClientDashboard />}
        />


        {/* =========================
            CLIENT ORDERS
        ========================= */}

        <Route
          path="/client/orders"
          element={<ClientOrders />}
        />

        {/* Single Client Order */}

        <Route
          path="/client/orders/:id"
          element={<ClientOrderDetails />}
        />


        {/* =========================
            CLIENT PAYMENTS
        ========================= */}

        <Route
          path="/client/payments"
          element={<ClientPayments />}
        />

      </Route>


      {/* =====================================================
          DEFAULT
      ===================================================== */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />


      {/* =====================================================
          UNKNOWN ROUTE
      ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;