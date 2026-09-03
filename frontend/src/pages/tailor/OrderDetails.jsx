import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOrder,
  deleteOrder,
  updateOrderStatus,
} from "../../api/orders.api";


// ==========================================
// STATUS OPTIONS
// ==========================================

const statuses = [
  "PENDING",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CANCELLED",
];


const OrderDetails = () => {
  const { id: orderId } = useParams();

  const navigate = useNavigate();


  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // FETCH ORDER
  // ==========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getOrder(orderId);

      console.log(
        "Order details response:",
        JSON.stringify(
          response,
          null,
          2
        )
      );

      setOrder(
        response?.order || null
      );

    } catch (err) {

      console.error(
        "Get order details error:",
        err.response?.data ||
          err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load order."
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
      fetchOrder();
    }

  }, [orderId]);


  // ==========================================
  // STATUS UPDATE
  // ==========================================

  const handleStatusChange = async (
    e
  ) => {

    const status =
      e.target.value;


    try {

      setUpdatingStatus(true);
      setError("");
      setSuccess("");


      const response =
        await updateOrderStatus(
          orderId,
          status
        );


      console.log(
        "Status update response:",
        JSON.stringify(
          response,
          null,
          2
        )
      );


      setOrder((prev) => ({
        ...prev,
        status,
      }));


      setSuccess(
        response?.message ||
          "Order status updated successfully."
      );

    } catch (err) {

      console.error(
        "Status update error:",
        err.response?.data ||
          err.message
      );


      setError(
        err.response?.data?.message ||
          "Failed to update status."
      );

    } finally {
      setUpdatingStatus(false);
    }
  };


  // ==========================================
  // DELETE ORDER
  // ==========================================

  const handleDelete = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this order?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeleting(true);
      setError("");


      await deleteOrder(orderId);


      navigate("/tailor/orders");

    } catch (err) {

      console.error(
        "Delete order error:",
        err.response?.data ||
          err.message
      );


      setError(
        err.response?.data?.message ||
          "Failed to delete order."
      );

    } finally {
      setDeleting(false);
    }
  };


  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatAmount = (
    amount
  ) => {

    return `Rs. ${Number(
      amount || 0
    ).toLocaleString()}`;
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "-";
    }


    return new Date(
      date
    ).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (
    status
  ) => {

    switch (status) {

      case "PENDING":
        return "bg-yellow-100 text-yellow-800";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";

      case "READY":
        return "bg-green-100 text-green-800";

      case "DELIVERED":
        return "bg-slate-100 text-slate-800";

      case "CANCELLED":
        return "bg-red-100 text-red-800";

      default:
        return "bg-slate-100 text-slate-800";
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
            Loading order...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (!order) {

    return (
      <div className="mx-auto max-w-3xl">

        <div className="rounded-xl bg-white p-10 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
            ⚠️
          </div>


          <h1 className="text-xl font-bold text-slate-900">
            Order not found
          </h1>


          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "The requested order could not be found."}
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/tailor/orders")
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Orders
          </button>

        </div>

      </div>
    );
  }


  const client =
    order.client || {};


  const remainingAmount =
    order.remainingAmount !==
    undefined
      ? order.remainingAmount
      : Math.max(
          0,
          Number(
            order.totalAmount || 0
          ) -
            Number(
              order.advanceAmount || 0
            )
        );


  return (
    <div className="mx-auto max-w-6xl space-y-6">

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


        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-2xl font-bold text-slate-900">
                Order Details
              </h1>


              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  order.status
                )}`}
              >
                {(
                  order.status ||
                  "PENDING"
                ).replace(
                  /_/g,
                  " "
                )}
              </span>

            </div>


            <p className="mt-1 text-sm text-slate-500">
              Order #
              {order._id?.slice(-8)}
            </p>

          </div>


          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/tailor/orders/${order._id}/edit`
                )
              }
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Order
            </button>


            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>

          </div>

        </div>

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
          TOP CARDS
      ====================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Amount
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatAmount(
              order.totalAmount
            )}
          </p>

        </div>


        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Advance Paid
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatAmount(
              order.advanceAmount
            )}
          </p>

        </div>


        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Remaining
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-600">
            {formatAmount(
              remainingAmount
            )}
          </p>

        </div>


        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Delivery Date
          </p>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatDate(
              order.deliveryDate
            )}
          </p>

        </div>

      </div>


      <div className="grid gap-6 lg:grid-cols-3">

        {/* ====================================
            CLIENT INFORMATION
        ==================================== */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Client Information
          </h2>


          <div className="mt-5 space-y-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {client.name ||
                  "Unknown Client"}
              </p>

            </div>


            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {client.phone ||
                  "-"}
              </p>

            </div>


            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm text-slate-700">
                {client.email ||
                  "-"}
              </p>

            </div>


            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Address
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {client.address ||
                  "-"}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                client._id &&
                navigate(
                  `/tailor/clients/${client._id}`
                )
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View Client
            </button>

          </div>

        </div>


        {/* ====================================
            ORDER INFORMATION
        ==================================== */}

        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">

          <h2 className="text-lg font-semibold text-slate-900">
            Order Information
          </h2>


          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Clothing Type
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {order.clothingType
                  ? order.clothingType.replace(
                      /_/g,
                      " "
                    )
                  : "-"}
              </p>

            </div>


            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fabric
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {order.fabric ||
                  "-"}
              </p>

            </div>


            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quantity
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {order.quantity ||
                  0}
              </p>

            </div>


            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(
                  order.createdAt
                )}
              </p>

            </div>


            <div className="sm:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                {order.notes ||
                  "No notes added."}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          STATUS
      ====================================== */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Order Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the current production status.
            </p>

          </div>


          <select
            value={
              order.status ||
              "PENDING"
            }
            onChange={
              handleStatusChange
            }
            disabled={updatingStatus}
            className={`rounded-lg border-0 px-5 py-3 text-sm font-semibold outline-none ${getStatusClass(
              order.status
            )}`}
          >

            {statuses.map(
              (status) => (

                <option
                  key={status}
                  value={status}
                >
                  {status.replace(
                    /_/g,
                    " "
                  )}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* ======================================
          PAYMENTS
      ====================================== */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Payments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View payment history and manage payments for this order.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                `/tailor/orders/${order._id}/payments`
              )
            }
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View Payments
          </button>

        </div>


        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-lg bg-slate-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Order Total
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatAmount(
                order.totalAmount
              )}
            </p>

          </div>


          <div className="rounded-lg bg-green-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
              Paid
            </p>

            <p className="mt-2 text-xl font-bold text-green-700">
              {formatAmount(
                order.advanceAmount
              )}
            </p>

          </div>


          <div className="rounded-lg bg-orange-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Remaining
            </p>

            <p className="mt-2 text-xl font-bold text-orange-700">
              {formatAmount(
                remainingAmount
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};


export default OrderDetails;
