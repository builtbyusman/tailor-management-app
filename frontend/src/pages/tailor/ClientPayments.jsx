import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getOrders } from "../../api/orders.api";
import { getPayments } from "../../api/payments.api";

const ClientPayments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const clientId = searchParams.get("clientId");

  const [payments, setPayments] = useState([]);
  const [clientName, setClientName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PAYMENTS
  // ==========================================

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      // ========================================
      // GET ALL ORDERS
      // ========================================

      const ordersResponse = await getOrders();

      const allOrders = ordersResponse?.orders || [];

      // ========================================
      // FILTER CLIENT ORDERS IF clientId EXISTS
      // ========================================

      let selectedOrders = allOrders;

      if (clientId) {
        selectedOrders = allOrders.filter((order) => {
          const orderClientId =
            order?.client?._id ||
            order?.client ||
            order?.clientId;

          return (
            String(orderClientId) ===
            String(clientId)
          );
        });

        // Get client name
        if (selectedOrders.length > 0) {
          setClientName(
            selectedOrders[0]?.client?.name ||
              selectedOrders[0]?.clientName ||
              ""
          );
        } else {
          setClientName("");
        }
      } else {
        setClientName("");
      }

      // ========================================
      // GET PAYMENTS FOR ORDERS
      // ========================================

      const paymentResults = await Promise.all(
        selectedOrders.map(async (order) => {
          try {
            const response = await getPayments(
              order._id
            );

            const orderPayments =
              response?.payments || [];

            return orderPayments.map((payment) => ({
              ...payment,
              order,
            }));
          } catch (err) {
            console.error(
              `Payment error for order ${order._id}:`,
              err.response?.data || err.message
            );

            return [];
          }
        })
      );

      // ========================================
      // FLATTEN PAYMENTS
      // ========================================

      const allPayments =
        paymentResults.flat();

      // ========================================
      // SORT LATEST FIRST
      // ========================================

      allPayments.sort((a, b) => {
        return (
          new Date(
            b.createdAt || b.date || 0
          ) -
          new Date(
            a.createdAt || a.date || 0
          )
        );
      });

      setPayments(allPayments);
    } catch (err) {
      console.error(
        "Load payments error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadPayments();
  }, [clientId]);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatAmount = (amount) => {
    const number = Number(amount || 0);

    return `Rs. ${number.toLocaleString(
      "en-PK",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // TOTAL PAID
  // ==========================================

  const totalPaid = payments.reduce(
    (total, payment) => {
      return (
        total +
        Number(payment.amount || 0)
      );
    },
    0
  );

  // ==========================================
  // UNIQUE ORDERS
  // ==========================================

  const uniqueOrders = [
    ...new Set(
      payments
        .map(
          (payment) =>
            payment.order?._id
        )
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // TOTAL REMAINING
  // ==========================================

  const remainingAmount = uniqueOrders.reduce(
    (total, orderId) => {
      const payment = payments.find(
        (item) =>
          item.order?._id === orderId
      );

      return (
        total +
        Number(
          payment?.order?.remainingAmount ||
            0
        )
      );
    },
    0
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-500">
            Loading payments...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          {clientId && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/tailor/clients/${clientId}`
                )
              }
              className="mb-3 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              ← Back to Client
            </button>
          )}

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {clientId
              ? clientName
                ? `${clientName}'s Payments`
                : "Client Payments"
              : "Payments"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {clientId
              ? "View all payments made by this client."
              : "Manage and track all customer payments."}
          </p>

        </div>

        {/* VIEW ORDERS */}

        <button
          type="button"
          onClick={() =>
            navigate("/tailor/orders")
          }
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View Orders
        </button>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadPayments}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>

          </div>

        </div>
      )}

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL PAYMENTS */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Payments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {payments.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
              💳
            </div>

          </div>

        </div>

        {/* TOTAL PAID */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Paid
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {formatAmount(totalPaid)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl">
              💰
            </div>

          </div>

        </div>

        {/* ORDERS */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Orders With Payments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {uniqueOrders.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl">
              🧵
            </div>

          </div>

        </div>

        {/* REMAINING */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Remaining Amount
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatAmount(
                  remainingAmount
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-xl">
              📌
            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          PAYMENT HISTORY
      ====================================== */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="border-b border-slate-200 p-5 sm:p-6">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Payment History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {clientId
                  ? "All payments for this client."
                  : "All payments received from customers."}
              </p>

            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {payments.length}{" "}
              {payments.length === 1
                ? "Payment"
                : "Payments"}
            </div>

          </div>

        </div>

        {/* EMPTY */}

        {payments.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-5xl">
              💳
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No payments found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {clientId
                ? "This client does not have any payment history yet."
                : "No payments have been recorded yet."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/tailor/orders")
              }
              className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Orders
            </button>

          </div>
        ) : (

          /* TABLE */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  {!clientId && (
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>
                  )}

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Method
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Remaining
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Notes
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {payments.map((payment, index) => {

                  const order = payment.order;

                  const paymentClient =
                    order?.client;

                  return (
                    <tr
                      key={
                        payment._id ||
                        `${order?._id}-${index}`
                      }
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      {/* CLIENT */}

                      {!clientId && (
                        <td className="px-5 py-4">

                          <p className="font-medium text-slate-900">
                            {paymentClient?.name ||
                              order?.clientName ||
                              "Unknown Client"}
                          </p>

                          {paymentClient?.phone && (
                            <p className="mt-1 text-xs text-slate-500">
                              {paymentClient.phone}
                            </p>
                          )}

                        </td>
                      )}

                      {/* ORDER */}

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/tailor/orders/${order?._id}`
                            )
                          }
                          className="text-left text-sm font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                        >
                          {order?.clothingType ||
                            "Order"}
                        </button>

                        {order?._id && (
                          <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                            #{order._id}
                          </p>
                        )}

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(
                          payment.createdAt ||
                            payment.date
                        )}
                      </td>

                      {/* AMOUNT */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-bold text-green-700">
                          {formatAmount(
                            payment.amount
                          )}
                        </span>

                      </td>

                      {/* METHOD */}

                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {(
                            payment.paymentMethod ||
                            "-"
                          ).replace(
                            /_/g,
                            " "
                          )}
                        </span>

                      </td>

                      {/* REMAINING */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-semibold text-red-600">
                          {formatAmount(
                            order?.remainingAmount
                          )}
                        </span>

                      </td>

                      {/* NOTES */}

                      <td className="max-w-[220px] px-5 py-4">

                        <p className="truncate text-sm text-slate-500">
                          {payment.notes ||
                            "-"}
                        </p>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/tailor/orders/${order?._id}`
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            View Order
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default ClientPayments;