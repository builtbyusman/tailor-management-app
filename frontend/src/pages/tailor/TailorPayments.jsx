import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getOrders } from "../../api/orders.api";
import { getPayments } from "../../api/payments.api";

const TailorPayments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ALL TAILOR PAYMENTS
  // ==========================================

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      // Get all orders belonging to logged-in tailor
      const ordersResponse = await getOrders();

      const allOrders = ordersResponse?.orders || [];

      // Get payment history for every order
      const paymentResults = await Promise.all(
        allOrders.map(async (order) => {
          try {
            const response = await getPayments(order._id);

            const orderPayments = response?.payments || [];

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

      // Combine all order payments into one array
      const allPayments = paymentResults.flat();

      // Latest payments first
      allPayments.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPayments(allPayments);
    } catch (err) {
      console.error(
        "Load tailor payments error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load payment history."
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
  }, []);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatAmount = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
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
    <div className="mx-auto max-w-6xl space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Payments
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          All payment history for your orders.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Payments
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {payments.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Paid
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatAmount(
              payments.reduce(
                (total, payment) =>
                  total +
                  Number(payment.amount || 0),
                0
              )
            )}
          </p>
        </div>

      </div>

      {/* PAYMENT HISTORY */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            All payments received for your orders.
          </p>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-4xl">
              💳
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No payments found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There is no payment history yet.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Method
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Notes
                  </th>

                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(payment.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {payment.order?.client?.name ||
                        payment.client?.name ||
                        payment.order?.clientName ||
                        "-"}
                    </td>

                    <td className="px-5 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/tailor/orders/${payment.order?._id}`
                          )
                        }
                        className="text-sm font-medium text-slate-900 hover:underline"
                      >
                        {payment.order?.clothingType ||
                          "Order"}
                      </button>

                      <p className="mt-1 text-xs text-slate-400">
                        #{payment.order?._id}
                      </p>

                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-green-700">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {(payment.paymentMethod || "-").replace(
                        /_/g,
                        " "
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {payment.notes || "-"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default TailorPayments;
