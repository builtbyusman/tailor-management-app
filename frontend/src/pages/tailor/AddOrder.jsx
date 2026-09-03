import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getClients } from "../../api/clients.api";
import { createOrder } from "../../api/orders.api";


// ==========================================
// INITIAL FORM
// ==========================================

const initialForm = {
  clientId: "",
  clothingType: "",
  fabric: "",
  quantity: 1,
  totalAmount: "",
  advanceAmount: 0,
  status: "PENDING",
  deliveryDate: "",
  notes: "",
};


// ==========================================
// CLOTHING TYPES
// ==========================================

const clothingTypes = [
  "SHALWAR_KAMEEZ",
  "KURTA",
  "SHIRT",
  "TROUSER",
  "PANT",
  "COAT",
  "WAISTCOAT",
  "SUIT",
  "OTHER",
];


const AddOrder = () => {
  const navigate = useNavigate();

  const [clients, setClients] =
    useState([]);

  const [formData, setFormData] =
    useState(initialForm);

  const [loadingClients, setLoadingClients] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD CLIENTS
  // ==========================================

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      setError("");

      const response =
        await getClients();

      console.log(
        "Clients for order:",
        JSON.stringify(
          response,
          null,
          2
        )
      );

      setClients(
        response?.clients || []
      );

    } catch (err) {

      console.error(
        "Load clients error:",
        err.response?.data ||
          err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load clients."
      );

    } finally {
      setLoadingClients(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchClients();
  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    // ------------------------------
    // Validation
    // ------------------------------

    if (!formData.clientId) {
      setError(
        "Please select a client."
      );
      return;
    }


    if (!formData.clothingType) {
      setError(
        "Please select clothing type."
      );
      return;
    }


    const totalAmount =
      Number(formData.totalAmount);


    const advanceAmount =
      Number(formData.advanceAmount);


    const quantity =
      Number(formData.quantity);


    if (
      !totalAmount ||
      totalAmount <= 0
    ) {
      setError(
        "Total amount must be greater than 0."
      );
      return;
    }


    if (
      advanceAmount < 0
    ) {
      setError(
        "Advance amount cannot be negative."
      );
      return;
    }


    if (
      advanceAmount > totalAmount
    ) {
      setError(
        "Advance amount cannot be greater than total amount."
      );
      return;
    }


    if (
      !quantity ||
      quantity <= 0
    ) {
      setError(
        "Quantity must be greater than 0."
      );
      return;
    }


    // ------------------------------
    // Request data
    // ------------------------------

    const orderData = {
      clothingType:
        formData.clothingType,

      fabric:
        formData.fabric.trim(),

      quantity,

      totalAmount,

      advanceAmount,

      status:
        formData.status,

      deliveryDate:
        formData.deliveryDate ||
        undefined,

      notes:
        formData.notes.trim(),
    };


    console.log(
      "Creating order:",
      JSON.stringify(
        {
          clientId:
            formData.clientId,
          ...orderData,
        },
        null,
        2
      )
    );


    try {

      setSaving(true);


      const response =
        await createOrder(
          formData.clientId,
          orderData
        );


      console.log(
        "Create order response:",
        JSON.stringify(
          response,
          null,
          2
        )
      );


      setSuccess(
        response?.message ||
          "Order created successfully."
      );


      // --------------------------------
      // Go to order details
      // --------------------------------

      const createdOrder =
        response?.order;


      if (createdOrder?._id) {

        setTimeout(() => {
          navigate(
            `/tailor/orders/${createdOrder._id}`
          );
        }, 700);

      } else {

        setTimeout(() => {
          navigate(
            "/tailor/orders"
          );
        }, 700);

      }

    } catch (err) {

      console.error(
        "Create order error:",
        err.response?.data ||
          err.message
      );


      setError(
        err.response?.data?.message ||
          "Failed to create order."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // LOADING CLIENTS
  // ==========================================

  if (loadingClients) {

    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-500">
            Loading clients...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div>

        <button
          type="button"
          onClick={() =>
            navigate("/tailor/orders")
          }
          className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Orders
        </button>


        <h1 className="text-2xl font-bold text-slate-900">
          Create Order
        </h1>


        <p className="mt-1 text-sm text-slate-500">
          Create a new tailoring order for a client.
        </p>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-800">
            {error}
          </p>

        </div>

      )}


      {/* ======================================
          SUCCESS
      ====================================== */}

      {success && (

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">

          <p className="text-sm font-medium text-green-800">
            {success}
          </p>

        </div>

      )}


      {/* ======================================
          NO CLIENTS
      ====================================== */}

      {clients.length === 0 ? (

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            👤
          </div>


          <h2 className="text-lg font-semibold text-slate-900">
            No clients found
          </h2>


          <p className="mt-2 text-sm text-slate-500">
            You need to create a client before creating an order.
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/tailor/clients")
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add Client
          </button>

        </div>

      ) : (

        /* ====================================
           FORM
        ==================================== */

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm sm:p-8"
        >

          {/* CLIENT */}

          <div className="mb-8">

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Client
            </h2>


            <label
              htmlFor="clientId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Select Client
            </label>


            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            >

              <option value="">
                -- Select Client --
              </option>


              {clients.map(
                (client) => (

                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.name} —{" "}
                    {client.phone}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ORDER DETAILS */}

          <div className="border-t border-slate-100 pt-8">

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Order Details
            </h2>


            <div className="grid gap-5 sm:grid-cols-2">

              {/* CLOTHING TYPE */}

              <div>

                <label
                  htmlFor="clothingType"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Clothing Type *
                </label>


                <select
                  id="clothingType"
                  name="clothingType"
                  value={
                    formData.clothingType
                  }
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >

                  <option value="">
                    -- Select Type --
                  </option>


                  {clothingTypes.map(
                    (type) => (

                      <option
                        key={type}
                        value={type}
                      >
                        {type.replace(
                          /_/g,
                          " "
                        )}
                      </option>

                    )
                  )}

                </select>

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
                  placeholder="e.g. Cotton, Wash & Wear"
                  disabled={saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />

              </div>


              {/* QUANTITY */}

              <div>

                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Quantity *
                </label>


                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={
                    formData.quantity
                  }
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />

              </div>


              {/* STATUS */}

              <div>

                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>


                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="READY">
                    Ready
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>

                </select>

              </div>


              {/* TOTAL */}

              <div>

                <label
                  htmlFor="totalAmount"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Total Amount *
                </label>


                <input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={
                    formData.totalAmount
                  }
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  disabled={saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
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
                  value={
                    formData.advanceAmount
                  }
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  disabled={saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />

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
                  value={
                    formData.deliveryDate
                  }
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />

              </div>

            </div>


            {/* NOTES */}

            <div className="mt-5">

              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Notes
              </label>


              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Special instructions..."
                disabled={saving}
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />

            </div>

          </div>


          {/* SUMMARY */}

          <div className="mt-8 rounded-lg bg-slate-50 p-5">

            <h3 className="mb-4 font-semibold text-slate-900">
              Payment Summary
            </h3>


            <div className="grid gap-3 text-sm sm:grid-cols-3">

              <div>

                <p className="text-slate-500">
                  Total
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  Rs.{" "}
                  {Number(
                    formData.totalAmount || 0
                  ).toLocaleString()}
                </p>

              </div>


              <div>

                <p className="text-slate-500">
                  Advance
                </p>

                <p className="mt-1 text-lg font-bold text-green-700">
                  Rs.{" "}
                  {Number(
                    formData.advanceAmount || 0
                  ).toLocaleString()}
                </p>

              </div>


              <div>

                <p className="text-slate-500">
                  Remaining
                </p>

                <p className="mt-1 text-lg font-bold text-orange-600">
                  Rs.{" "}
                  {Math.max(
                    0,
                    Number(
                      formData.totalAmount || 0
                    ) -
                      Number(
                        formData.advanceAmount || 0
                      )
                  ).toLocaleString()}
                </p>

              </div>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/tailor/orders")
              }
              disabled={saving}
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating Order..."
                : "Create Order"}
            </button>

          </div>

        </form>

      )}

    </div>
  );
};

export default AddOrder;
