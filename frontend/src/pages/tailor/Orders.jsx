import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  getOrders,
  getClientOrders,
  deleteOrder,
  updateOrderStatus,
} from "../../api/orders.api";

const Orders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const clientId = searchParams.get("clientId");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clientName, setClientName] = useState("");

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      // ========================================
      // IF CLIENT ID EXISTS
      // GET ONLY THAT CLIENT'S ORDERS
      // ========================================

      if (clientId) {
        response = await getClientOrders(clientId);

        console.log(
          "Client orders response:",
          JSON.stringify(response, null, 2)
        );

        setOrders(response?.orders || []);

        // Get client name from first order
        const firstOrder = response?.orders?.[0];

        if (firstOrder?.client?.name) {
          setClientName(firstOrder.client.name);
        } else {
          setClientName("");
        }
      }

      // ========================================
      // OTHERWISE GET ALL ORDERS
      // ========================================

      else {
        response = await getOrders();

        console.log(
          "All orders response:",
          JSON.stringify(response, null, 2)
        );

        setOrders(response?.orders || []);
        setClientName("");
      }
    } catch (err) {
      console.error(
        "Get orders error:",
        JSON.stringify(
          err.response?.data || {
            message: err.message,
          },
          null,
          2
        )
      );

      setError(
        err.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, [clientId]);

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteOrder(orderId);

      await fetchOrders();
    } catch (err) {
      console.error(
        "Delete order error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete order."
      );
    }
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      await updateOrderStatus(
        orderId,
        status
      );

      await fetchOrders();
    } catch (err) {
      console.error(
        "Update status error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatAmount = (amount) => {
    return `Rs. ${Number(
      amount || 0
    ).toLocaleString()}`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "READY":
        return "bg-green-100 text-green-700";

      case "DELIVERED":
        return "bg-purple-100 text-purple-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-500">
            Loading orders...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          {clientId && (
            <button
              type="button"
              onClick={() =>
                navigate("/tailor/clients")
              }
              className="mb-3 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Clients
            </button>
          )}

          <h1 className="text-2xl font-bold text-slate-900">
            {clientId
              ? clientName
                ? `${clientName}'s Orders`
                : "Client Orders"
              : "Orders"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {clientId
              ? "View and manage orders for this client."
              : "Manage all customer orders."}
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/tailor/orders/add")
          }
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Add Order
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}

      {/* EMPTY */}

      {orders.length === 0 ? (

        <div className="rounded-xl bg-white p-12 text-center shadow-sm">

          <div className="text-5xl">
            📦
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            {clientId
              ? "No orders found for this client"
              : "No orders found"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {clientId
              ? "This client does not have any orders yet."
              : "Create your first order to get started."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/tailor/orders/add")
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Create Order
          </button>

        </div>

      ) : (

        /* ORDERS TABLE */

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Clothing
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quantity
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Advance
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Remaining
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Delivery
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {orders.map((order) => {

                  const client =
                    order.client;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      {/* CLIENT */}

                      <td className="px-5 py-4">

                        <div className="font-medium text-slate-900">
                          {client?.name ||
                            order.clientName ||
                            "Unknown Client"}
                        </div>

                        {client?.phone && (
                          <div className="mt-1 text-xs text-slate-500">
                            {client.phone}
                          </div>
                        )}

                      </td>

                      {/* CLOTHING */}

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {order.clothingType ||
                          "-"}
                      </td>

                      {/* QUANTITY */}

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {order.quantity || 0}
                      </td>

                      {/* TOTAL */}

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {formatAmount(
                          order.totalAmount
                        )}
                      </td>

                      {/* ADVANCE */}

                      <td className="px-5 py-4 text-sm text-green-700">
                        {formatAmount(
                          order.advanceAmount
                        )}
                      </td>

                      {/* REMAINING */}

                      <td className="px-5 py-4 text-sm font-semibold text-red-600">
                        {formatAmount(
                          order.remainingAmount
                        )}
                      </td>

                      {/* DELIVERY */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(
                          order.deliveryDate
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <select
                          value={
                            order.status ||
                            "PENDING"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusClass(
                            order.status
                          )}`}
                        >

                          <option value="PENDING">
                            PENDING
                          </option>

                          <option value="IN_PROGRESS">
                            IN PROGRESS
                          </option>

                          <option value="READY">
                            READY
                          </option>

                          <option value="DELIVERED">
                            DELIVERED
                          </option>

                        </select>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/tailor/orders/${order._id}`
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/tailor/orders/${order._id}/payments`
                              )
                            }
                            className="rounded-lg border border-green-300 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50"
                          >
                            Payments
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                order._id
                              )
                            }
                            className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default Orders;
