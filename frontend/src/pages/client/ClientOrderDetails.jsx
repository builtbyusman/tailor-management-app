import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const ClientOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/client/orders/${id}`);

        console.log("Client order details response:", response.data);

        setOrder(response.data?.order || null);
      } catch (err) {
        console.error(
          "Client order details error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

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
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-600">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/client/orders")}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Unable to Load Order
            </h2>

            <p className="text-gray-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/client/orders")}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Order Not Found
            </h2>

            <p className="text-gray-600">
              This order could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/client/orders")}
          className="mb-6 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-700 transition"
        >
          ← Back to Orders
        </button>

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Order ID
              </p>

              <h1 className="text-2xl font-bold text-gray-800 break-all">
                #{order._id}
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Created on {formatDate(order.createdAt)}
              </p>
            </div>

            <div>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status || "N/A"}
              </span>
            </div>

          </div>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Order Details
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="text-gray-500">
                  Clothing Type
                </span>

                <span className="font-medium text-gray-800 text-right">
                  {order.clothingType || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="text-gray-500">
                  Fabric
                </span>

                <span className="font-medium text-gray-800 text-right">
                  {order.fabric || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="text-gray-500">
                  Quantity
                </span>

                <span className="font-medium text-gray-800">
                  {order.quantity ?? "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="text-gray-500">
                  Delivery Date
                </span>

                <span className="font-medium text-gray-800 text-right">
                  {formatDate(order.deliveryDate)}
                </span>
              </div>

              {order.notes && (
                <div>
                  <p className="text-gray-500 mb-2">
                    Notes
                  </p>

                  <p className="text-gray-800 bg-gray-50 rounded-lg p-3">
                    {order.notes}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Payment Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="text-gray-500">
                  Total Amount
                </span>

                <span className="font-semibold text-gray-800">
                  Rs. {formatAmount(order.totalAmount)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="text-gray-500">
                  Advance Paid
                </span>

                <span className="font-semibold text-green-600">
                  Rs. {formatAmount(order.advanceAmount)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="text-gray-500">
                  Remaining Amount
                </span>

                <span className="font-semibold text-red-600">
                  Rs.{" "}
                  {formatAmount(
                    order.remainingAmount ??
                      Number(order.totalAmount || 0) -
                        Number(order.advanceAmount || 0)
                  )}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Client Information */}
        {order.client && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Client Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Name
                </p>

                <p className="font-medium text-gray-800">
                  {order.client.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Phone
                </p>

                <p className="font-medium text-gray-800">
                  {order.client.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Email
                </p>

                <p className="font-medium text-gray-800">
                  {order.client.email || "N/A"}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/client/orders")}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"
          >
            ← All Orders
          </button>

          <button
            onClick={() => navigate("/client/payments")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            View Payments
          </button>

        </div>

      </div>
    </div>
  );
};

export default ClientOrderDetails;