import { useEffect, useState } from "react";

import { getDashboard } from "../../api/dashboard.api";

import {
  getOrderSummary,
  getRecentOrders,
  getPendingOrders,
  getReadyOrders,
} from "../../api/orders.api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);

  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          dashboardResponse,
          summaryResponse,
          recentResponse,
          pendingResponse,
          readyResponse,
        ] = await Promise.all([
          getDashboard(),
          getOrderSummary(),
          getRecentOrders(),
          getPendingOrders(),
          getReadyOrders(),
        ]);

        console.log(
          "Dashboard response:",
          dashboardResponse
        );

        console.log(
          "Order summary response:",
          summaryResponse
        );

        setDashboard(
          dashboardResponse?.dashboard || null
        );

        setOrderSummary(
          summaryResponse?.summary || null
        );

        setRecentOrders(
          recentResponse?.orders || []
        );

        setPendingOrders(
          pendingResponse?.orders || []
        );

        setReadyOrders(
          readyResponse?.orders || []
        );
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatAmount = (amount) => {
    const numericAmount = Number(amount || 0);

    return `Rs. ${numericAmount.toLocaleString(
      "en-PK",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="w-full bg-slate-100 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-800">
              Dashboard Error
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // SUMMARY
  // ==========================================

  const summary =
    dashboard?.summary ||
    orderSummary ||
    {};

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl min-w-0">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Tailor Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Manage your clients, orders and payments.
          </p>
        </div>

        {/* ======================================
            MAIN SUMMARY CARDS
        ====================================== */}

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL ORDERS */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Orders
            </p>

            <h2 className="mt-2 break-words text-3xl font-bold text-slate-900">
              {summary.totalOrders ?? 0}
            </h2>
          </div>

          {/* TOTAL REVENUE */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Revenue
            </p>

            <h2 className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
              {formatAmount(
                summary.totalRevenue
              )}
            </h2>
          </div>

          {/* TOTAL ADVANCE */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Advance
            </p>

            <h2 className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
              {formatAmount(
                summary.totalAdvance
              )}
            </h2>
          </div>

          {/* REMAINING */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Remaining Amount
            </p>

            <h2 className="mt-2 break-words text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {formatAmount(
                summary.totalRemaining
              )}
            </h2>
          </div>
        </div>

        {/* ======================================
            ORDER STATUS CARDS
        ====================================== */}

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">

          {/* PENDING */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {summary.pendingOrders ?? 0}
            </h2>
          </div>

          {/* READY */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Ready Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {summary.readyOrders ?? 0}
            </h2>
          </div>

          {/* DELIVERED */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Delivered Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {summary.deliveredOrders ?? 0}
            </h2>
          </div>
        </div>

        {/* ======================================
            RECENT ORDERS
        ====================================== */}

        <div className="mt-8 min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center justify-between gap-4">

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest orders
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {recentOrders.length}
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-lg bg-slate-50 px-4 py-10 text-center">
              <p className="text-sm text-slate-500">
                No recent orders found.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">

                <thead>
                  <tr className="border-b border-slate-200">

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Client
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Clothing
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Quantity
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map(
                    (order, index) => (
                      <tr
                        key={
                          order._id ||
                          index
                        }
                        className="border-b border-slate-100 last:border-0"
                      >

                        <td className="px-4 py-4 text-sm font-medium text-slate-800">
                          {order.client?.name ||
                            order.clientName ||
                            "N/A"}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {order.clothingType ||
                            "N/A"}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {order.quantity ?? 0}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-slate-700">
                          {formatAmount(
                            order.totalAmount
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {order.status ||
                              "N/A"}
                          </span>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* ======================================
            PENDING + READY
        ====================================== */}

        <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ====================================
              PENDING ORDERS
          ==================================== */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center justify-between gap-4">

              <h2 className="text-xl font-bold text-slate-900">
                Pending Orders
              </h2>

              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {pendingOrders.length}
              </span>

            </div>

            {pendingOrders.length === 0 ? (
              <div className="rounded-lg bg-slate-50 px-4 py-8 text-center">
                <p className="text-sm text-slate-500">
                  No pending orders.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {pendingOrders
                  .slice(0, 5)
                  .map((order, index) => (
                    <div
                      key={
                        order._id ||
                        index
                      }
                      className="min-w-0 rounded-lg border border-slate-200 p-4"
                    >

                      <div className="flex min-w-0 items-center justify-between gap-4">

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">
                            {order.client?.name ||
                              "Unknown Client"}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {order.clothingType ||
                              "Order"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {order.status ||
                            "PENDING"}
                        </span>

                      </div>
                    </div>
                  ))}

              </div>
            )}
          </div>

          {/* ====================================
              READY ORDERS
          ==================================== */}

          <div className="min-w-0 overflow-hidden rounded-xl bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center justify-between gap-4">

              <h2 className="text-xl font-bold text-slate-900">
                Ready Orders
              </h2>

              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {readyOrders.length}
              </span>

            </div>

            {readyOrders.length === 0 ? (
              <div className="rounded-lg bg-slate-50 px-4 py-8 text-center">
                <p className="text-sm text-slate-500">
                  No ready orders.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {readyOrders
                  .slice(0, 5)
                  .map((order, index) => (
                    <div
                      key={
                        order._id ||
                        index
                      }
                      className="min-w-0 rounded-lg border border-slate-200 p-4"
                    >

                      <div className="flex min-w-0 items-center justify-between gap-4">

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">
                            {order.client?.name ||
                              "Unknown Client"}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {order.clothingType ||
                              "Order"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {order.status ||
                            "READY"}
                        </span>

                      </div>
                    </div>
                  ))}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;