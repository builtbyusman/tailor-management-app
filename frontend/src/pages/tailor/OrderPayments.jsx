import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
createPayment,
getPayments,
getPaymentSummary,
} from "../../api/payments.api";

const OrderPayments = () => {
const { id: orderId } = useParams();
const navigate = useNavigate();

const [payments, setPayments] = useState([]);
const [summary, setSummary] = useState(null);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [formData, setFormData] = useState({
amount: "",
paymentMethod: "CASH",
notes: "",
});

// ==========================================
// LOAD PAYMENTS
// ==========================================

const loadPayments = async () => {
try {
setLoading(true);
setError("");


  const [paymentsResponse, summaryResponse] =
    await Promise.all([
      getPayments(orderId),
      getPaymentSummary(orderId),
    ]);

  console.log(
    "Payments response:",
    paymentsResponse
  );

  console.log(
    "Payment summary response:",
    summaryResponse
  );

  setPayments(
    paymentsResponse?.payments || []
  );

  setSummary(
    summaryResponse?.summary || null
  );
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
if (orderId) {
loadPayments();
}
}, [orderId]);

// ==========================================
// INPUT CHANGE
// ==========================================

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((prev) => ({
  ...prev,
  [name]: value,
}));


};

// ==========================================
// CREATE PAYMENT
// ==========================================

const handleSubmit = async (e) => {
e.preventDefault();

setError("");
setSuccess("");

const amount = Number(formData.amount);

if (!amount || amount <= 0) {
  setError(
    "Payment amount must be greater than 0."
  );
  return;
}

try {
  setSaving(true);

  const paymentData = {
    amount,
    paymentMethod:
      formData.paymentMethod,
    notes: formData.notes.trim(),
  };

  console.log(
    "Creating payment:",
    paymentData
  );

  const response = await createPayment(
    orderId,
    paymentData
  );

  console.log(
    "Create payment response:",
    response
  );

  setSuccess(
    response?.message ||
      "Payment created successfully."
  );

  setFormData({
    amount: "",
    paymentMethod: "CASH",
    notes: "",
  });

  await loadPayments();
} catch (err) {
  console.error(
    "Create payment error:",
    err.response?.data || err.message
  );

  setError(
    err.response?.data?.message ||
      "Failed to create payment."
  );
} finally {
  setSaving(false);
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
// LOADING
// ==========================================

if (loading) {
return ( <div className="flex min-h-[400px] items-center justify-center"> <div className="text-center"> <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />


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

return ( <div className="mx-auto max-w-6xl space-y-6">


  {/* HEADER */}

  <div>
    <button
      type="button"
      onClick={() =>
        navigate(
          `/tailor/orders/${orderId}`
        )
      }
      className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
    >
      ← Back to Order
    </button>

    <h1 className="text-2xl font-bold text-slate-900">
      Order Payments
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Manage payments for this order.
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


  {/* SUCCESS */}

  {success && (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="text-sm font-medium text-green-700">
        {success}
      </p>
    </div>
  )}


  {/* SUMMARY */}

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        Order Total
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {formatAmount(
          summary?.totalAmount
        )}
      </p>
    </div>


    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        Total Paid
      </p>

      <p className="mt-2 text-2xl font-bold text-green-600">
        {formatAmount(
          summary?.totalPaid
        )}
      </p>
    </div>


    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        Remaining
      </p>

      <p className="mt-2 text-2xl font-bold text-orange-600">
        {formatAmount(
          summary?.remainingAmount
        )}
      </p>
    </div>


    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        Number of Payments
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {payments.length}
      </p>
    </div>

  </div>


  {/* CONTENT */}

  <div className="grid gap-6 lg:grid-cols-3">

    {/* ADD PAYMENT */}

    <div className="rounded-xl bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold text-slate-900">
        Add Payment
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Record a new payment.
      </p>


      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >

        {/* AMOUNT */}

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Amount *
          </label>

          <input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            disabled={saving}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>


        {/* PAYMENT METHOD */}

        <div>
          <label
            htmlFor="paymentMethod"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Payment Method
          </label>

          <select
            id="paymentMethod"
            name="paymentMethod"
            value={
              formData.paymentMethod
            }
            onChange={handleChange}
            disabled={saving}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="CASH">
              Cash
            </option>

            <option value="BANK_TRANSFER">
              Bank Transfer
            </option>

            <option value="JAZZCASH">
              JazzCash
            </option>

            <option value="EASYPAISA">
              EasyPaisa
            </option>

            <option value="CARD">
              Card
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>


        {/* NOTES */}

        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Notes
          </label>

          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional notes"
            disabled={saving}
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>


        {/* BUTTON */}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Adding Payment..."
            : "Add Payment"}
        </button>

      </form>

    </div>


    {/* PAYMENT HISTORY */}

    <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">

      <h2 className="text-lg font-semibold text-slate-900">
        Payment History
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        All payments for this order.
      </p>


      {payments.length === 0 ? (

        <div className="mt-8 rounded-lg bg-slate-50 p-8 text-center">

          <div className="text-3xl">
            💳
          </div>

          <p className="mt-3 font-medium text-slate-700">
            No payments found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            No payment has been recorded yet.
          </p>

        </div>

      ) : (

        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[600px] text-left">

            <thead>
              <tr className="border-b border-slate-200">

                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                  Date
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                  Amount
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                  Method
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                  Notes
                </th>

              </tr>
            </thead>


            <tbody>

              {payments.map(
                (payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-slate-100"
                  >

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatDate(
                        payment.createdAt
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-green-700">
                      {formatAmount(
                        payment.amount
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {(
                        payment.paymentMethod ||
                        "-"
                      ).replace(
                        /_/g,
                        " "
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {payment.notes ||
                        "-"}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  </div>

</div>

);
};

export default OrderPayments;
