import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getMyOrders,
} from "../../api/client-orders.api";

const ClientOrders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD CLIENT ORDERS
    // ==========================================

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMyOrders();

            console.log(
                "CLIENT ORDERS PAGE RESPONSE:",
                response
            );

            const clientOrders =
                Array.isArray(response?.orders)
                    ? response.orders
                    : [];

            setOrders(clientOrders);

        } catch (err) {
            console.error(
                "CLIENT ORDERS PAGE ERROR:",
                err.response?.status,
                err.response?.data || err.message
            );

            setOrders([]);

            setError(
                err.response?.data?.message ||
                    "Failed to load your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {
        loadOrders();
    }, []);

    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatAmount = (amount) => {
        return `Rs. ${Number(
            amount || 0
        ).toLocaleString("en-PK")}`;
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
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {
        const normalizedStatus =
            String(status || "").toUpperCase();

        switch (normalizedStatus) {
            case "READY":
                return "bg-green-100 text-green-700";

            case "DELIVERED":
                return "bg-blue-100 text-blue-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    // ==========================================
    // STATUS TEXT
    // ==========================================

    const getStatusText = (status) => {
        if (!status) {
            return "PENDING";
        }

        return String(status)
            .replace(/_/g, " ")
            .toUpperCase();
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
                        Loading your orders...
                    </p>

                </div>
            </div>
        );
    }

    // ==========================================
    // COUNTS
    // ==========================================

    const pendingOrders =
        orders.filter((order) => {
            const status = String(
                order.status || ""
            ).toUpperCase();

            return [
                "PENDING",
                "IN_PROGRESS",
            ].includes(status);
        }).length;

    const readyOrders =
        orders.filter(
            (order) =>
                String(
                    order.status || ""
                ).toUpperCase() === "READY"
        ).length;

    const deliveredOrders =
        orders.filter(
            (order) =>
                String(
                    order.status || ""
                ).toUpperCase() === "DELIVERED"
        ).length;

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="mx-auto max-w-7xl space-y-6">

            {/* HEADER */}

            <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    My Orders
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    View and track all your tailoring orders.
                </p>
            </div>


            {/* ERROR */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadOrders}
                        className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Orders
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {orders.length}
                    </p>
                </div>


                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Pending
                    </p>

                    <p className="mt-2 text-3xl font-bold text-yellow-600">
                        {pendingOrders}
                    </p>
                </div>


                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Ready
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {readyOrders}
                    </p>
                </div>


                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Delivered
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-600">
                        {deliveredOrders}
                    </p>
                </div>

            </div>


            {/* ORDER HISTORY */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="border-b border-slate-200 p-5 sm:p-6">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Order History
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        All orders placed with your tailor.
                    </p>

                </div>


                {/* NO ORDERS */}

                {orders.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="text-5xl">
                            🧵
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No orders found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            You don't have any orders yet.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px]">

                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Clothing
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Fabric
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
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Date
                                    </th>

                                </tr>
                            </thead>


                            <tbody>

                                {orders.map(
                                    (
                                        order,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                order._id ||
                                                index
                                            }
                                            className="border-b border-slate-100 transition hover:bg-slate-50"
                                        >

                                            {/* CLOTHING */}

                                            <td className="px-5 py-4">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/client/orders/${order._id}`
                                                        )
                                                    }
                                                    className="text-left text-sm font-semibold text-slate-900 hover:underline"
                                                >
                                                    {order.clothingType ||
                                                        "Order"}
                                                </button>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    #
                                                    {order._id ||
                                                        "-"}
                                                </p>

                                            </td>


                                            {/* FABRIC */}

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {order.fabric ||
                                                    "-"}
                                            </td>


                                            {/* QUANTITY */}

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {order.quantity ??
                                                    0}
                                            </td>


                                            {/* TOTAL */}

                                            <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                                {formatAmount(
                                                    order.totalAmount
                                                )}
                                            </td>


                                            {/* ADVANCE */}

                                            <td className="px-5 py-4 text-sm font-medium text-green-700">
                                                {formatAmount(
                                                    order.advanceAmount
                                                )}
                                            </td>


                                            {/* REMAINING */}

                                            <td className="px-5 py-4 text-sm font-medium text-orange-600">
                                                {formatAmount(
                                                    order.remainingAmount
                                                )}
                                            </td>


                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                        order.status
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        order.status
                                                    )}
                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {formatDate(
                                                    order.createdAt
                                                )}
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
    );
};

export default ClientOrders;