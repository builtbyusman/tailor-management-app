import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyOrders } from "../../api/client-orders.api";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

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

            const response = await getMyOrders();

            console.log(
                "CLIENT DASHBOARD ORDERS:",
                response
            );

            const clientOrders =
                Array.isArray(response?.orders)
                    ? response.orders
                    : [];

            setOrders(clientOrders);

        } catch (err) {
            console.error(
                "CLIENT DASHBOARD ERROR:",
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
    // SUMMARY
    // ==========================================

    const summary = useMemo(() => {
        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
            (order) => {
                const status = String(
                    order.status || ""
                ).toUpperCase();

                return [
                    "PENDING",
                    "IN_PROGRESS",
                ].includes(status);
            }
        ).length;

        const readyOrders = orders.filter(
            (order) =>
                String(
                    order.status || ""
                ).toUpperCase() === "READY"
        ).length;

        const deliveredOrders = orders.filter(
            (order) =>
                String(
                    order.status || ""
                ).toUpperCase() === "DELIVERED"
        ).length;

        const totalAmount = orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.totalAmount || 0
                ),
            0
        );

        const totalAdvance = orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.advanceAmount || 0
                ),
            0
        );

        const totalRemaining = orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.remainingAmount ??
                        (
                            Number(
                                order.totalAmount || 0
                            ) -
                            Number(
                                order.advanceAmount || 0
                            )
                        )
                ),
            0
        );

        return {
            totalOrders,
            pendingOrders,
            readyOrders,
            deliveredOrders,
            totalAmount,
            totalAdvance,
            totalRemaining,
        };
    }, [orders]);

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

    const getStatusClass = (status) => {
        const normalized = String(
            status || ""
        ).toUpperCase();

        switch (normalized) {
            case "DELIVERED":
                return "bg-green-100 text-green-700";

            case "READY":
                return "bg-blue-100 text-blue-700";

            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

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
            <div className="flex min-h-[500px] items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                    <p className="mt-4 text-sm text-slate-500">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // DASHBOARD
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Welcome,{" "}
                        {user?.name || "Client"} 👋
                    </h1>

                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                        Track your orders, payments and tailoring progress.
                    </p>
                </div>


                {/* ERROR */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadOrders}
                                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                            >
                                Try Again
                            </button>

                        </div>
                    </div>
                )}


                {/* ORDER SUMMARY */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* TOTAL ORDERS */}

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Total Orders
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {summary.totalOrders}
                        </p>
                    </div>


                    {/* PENDING */}

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Pending Orders
                        </p>

                        <p className="mt-2 text-3xl font-bold text-yellow-600">
                            {summary.pendingOrders}
                        </p>
                    </div>


                    {/* READY */}

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Ready Orders
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {summary.readyOrders}
                        </p>
                    </div>


                    {/* DELIVERED */}

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Delivered Orders
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {summary.deliveredOrders}
                        </p>
                    </div>

                </div>


                {/* FINANCIAL SUMMARY */}

                <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    <div className="min-w-0 rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Total Amount
                        </p>

                        <p className="mt-2 break-words text-2xl font-bold text-slate-900">
                            {formatAmount(
                                summary.totalAmount
                            )}
                        </p>
                    </div>


                    <div className="min-w-0 rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Total Paid
                        </p>

                        <p className="mt-2 break-words text-2xl font-bold text-green-600">
                            {formatAmount(
                                summary.totalAdvance
                            )}
                        </p>
                    </div>


                    <div className="min-w-0 rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Remaining Amount
                        </p>

                        <p className="mt-2 break-words text-2xl font-bold text-red-600">
                            {formatAmount(
                                summary.totalRemaining
                            )}
                        </p>
                    </div>

                </div>


                {/* RECENT ORDERS */}

                <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-slate-200 p-6">

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your latest tailoring orders
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/client/orders"
                                )
                            }
                            className="text-sm font-semibold text-slate-900 hover:underline"
                        >
                            View All
                        </button>

                    </div>


                    {/* NO ORDERS */}

                    {orders.length === 0 ? (

                        <div className="p-12 text-center">

                            <div className="text-4xl">
                                🧵
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-900">
                                No orders yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                You don't have any orders yet.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Clothing
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Quantity
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Amount
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Date
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                    </tr>
                                </thead>


                                <tbody>

                                    {orders
                                        .slice(0, 5)
                                        .map(
                                            (
                                                order,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        order._id ||
                                                        index
                                                    }
                                                    className="border-b border-slate-100 hover:bg-slate-50"
                                                >

                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {order.clothingType ||
                                                                "Order"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            #
                                                            {order._id ||
                                                                "-"}
                                                        </p>
                                                    </td>


                                                    <td className="px-5 py-4 text-sm text-slate-600">
                                                        {order.quantity ??
                                                            0}
                                                    </td>


                                                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                                                        {formatAmount(
                                                            order.totalAmount
                                                        )}
                                                    </td>


                                                    <td className="px-5 py-4 text-sm text-slate-600">
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </td>


                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {getStatusText(
                                                                order.status
                                                            )}
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

            </div>
        </div>
    );
};

export default Dashboard;