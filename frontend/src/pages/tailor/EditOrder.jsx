import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOrder,
  updateOrder,
} from "../../api/orders.api";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clothingType: "",
    fabric: "",
    quantity: 1,
    totalAmount: "",
    advanceAmount: "",
    deliveryDate: "",
  });

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrder(id);

        console.log(
          "Edit order response:",
          JSON.stringify(response, null, 2)
        );

        const order =
          response?.order ||
          response?.data?.order;

        if (!order) {
          setError("Order not found.");
          return;
        }

        setFormData({
          clothingType:
            order.clothingType || "",

          fabric:
            order.fabric || "",

          quantity:
            order.quantity ?? 1,

          totalAmount:
            order.totalAmount ?? "",

          advanceAmount:
            order.advanceAmount ?? "",

          deliveryDate: order.deliveryDate
            ? new Date(order.deliveryDate)
                .toISOString()
                .split("T")[0]
            : "",
        });
      } catch (err) {
        console.error(
          "Get order for edit error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.clothingType.trim()) {
      setError("Clothing type is required.");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (
      formData.totalAmount === "" ||
      Number(formData.totalAmount) <= 0
    ) {
      setError("Total amount must be greater than 0.");
      return;
    }

    if (
      formData.advanceAmount !== "" &&
      Number(formData.advanceAmount) < 0
    ) {
      setError("Advance amount cannot be negative.");
      return;
    }

    if (
      Number(formData.advanceAmount || 0) >
      Number(formData.totalAmount)
    ) {
      setError(
        "Advance amount cannot be greater than total amount."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        clothingType:
          formData.clothingType.trim(),

        fabric:
          formData.fabric.trim(),

        quantity:
          Number(formData.quantity),

        totalAmount:
          Number(formData.totalAmount),

        advanceAmount:
          Number(formData.advanceAmount || 0),

        ...(formData.deliveryDate
          ? {
              deliveryDate:
                formData.deliveryDate,
            }
          : {}),
      };

      console.log(
        "Update order payload:",
        JSON.stringify(payload, null, 2)
      );

      const response = await updateOrder(
        id,
        payload
      );

      console.log(
        "Update order response:",
        JSON.stringify(response, null, 2)
      );

      navigate(
        `/tailor/orders/${id}`,
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Update order error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update order."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-500">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="w-full min-w-0 bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(`/tailor/orders/${id}`)
          }
          className="mb-5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Order
        </button>

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Edit Order
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update order information.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >

          {/* CLOTHING TYPE */}

          <div>
            <label
              htmlFor="clothingType"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Clothing Type
            </label>

            <input
              id="clothingType"
              name="clothingType"
              type="text"
              value={formData.clothingType}
              onChange={handleChange}
              placeholder="e.g. Shalwar Kameez"
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
            />
          </div>

          {/* FABRIC */}

          <div>
            <label
              htmlFor="fabric"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Fabric
            </label>

            <input
              id="fabric"
              name="fabric"
              type="text"
              value={formData.fabric}
              onChange={handleChange}
              placeholder="e.g. Cotton"
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
            />
          </div>

          {/* QUANTITY */}

          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
            />
          </div>

          {/* AMOUNTS */}

          <div className="grid gap-5 sm:grid-cols-2">

            {/* TOTAL */}

            <div>
              <label
                htmlFor="totalAmount"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Total Amount
              </label>

              <input
                id="totalAmount"
                name="totalAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.totalAmount}
                onChange={handleChange}
                disabled={saving}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
              />
            </div>

            {/* ADVANCE */}

            <div>
              <label
                htmlFor="advanceAmount"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Advance Amount
              </label>

              <input
                id="advanceAmount"
                name="advanceAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.advanceAmount}
                onChange={handleChange}
                disabled={saving}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
              />
            </div>

          </div>

          {/* DELIVERY DATE */}

          <div>
            <label
              htmlFor="deliveryDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Delivery Date
            </label>

            <input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
            />
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate(`/tailor/orders/${id}`)
              }
              disabled={saving}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditOrder;