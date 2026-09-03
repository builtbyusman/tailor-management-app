import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

const ClientPayments = () => {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD CLIENT PAYMENTS
    // ==========================================

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/payments/my"
            );

            console.log(
                "Client payments response:",
                response.data
            );

            setPayments(
                response.data?.payments || []
            );

        } catch (err) {
            console.error(
                "Client payments error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to load your payments."
            );

            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {
        loadPayments();
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
    // TOTAL PAID
    // ==========================================

    const totalPaid = payments.reduce(
        (total, payment) =>
            total +
            Number(payment.amount || 0),
        0
    );

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                    <p className="mt-4 text-sm text-slate-500">
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
        <div className="mx-auto max-w-7xl space-y-6">

            {/* ==================================
                HEADER
            ================================== */}

            <div>

                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    My Payments
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View your complete payment history.
                </p>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadPayments}
                        className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="grid gap-4 sm:grid-cols-2">

                {/* TOTAL TRANSACTIONS */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <p className="text-sm font-medium text-slate-500">
                        Total Payments
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {payments.length}
                    </p>

                </div>


                {/* TOTAL PAID */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <p className="text-sm font-medium text-slate-500">
                        Total Paid
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {formatAmount(totalPaid)}
                    </p>

                </div>

            </div>


            {/* ==================================
                PAYMENT HISTORY
            ================================== */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="border-b border-slate-200 p-6">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Payment History
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        All payments made for your orders.
                    </p>

                </div>


                {/* ==================================
                    NO PAYMENTS
                ================================== */}

                {payments.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="text-5xl">
                            💳
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No payments found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            You don't have any payment history yet.
                        </p>

                    </div>

                ) : (

                    /* ==================================
                       TABLE
                    ================================== */

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[750px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Date
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

                                {payments.map(
                                    (payment, index) => {

                                        const order =
                                            payment.order;

                                        return (
                                            <tr
                                                key={
                                                    payment._id ||
                                                    index
                                                }
                                                className="border-b border-slate-100 transition hover:bg-slate-50"
                                            >

                                                {/* DATE */}

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {formatDate(
                                                        payment.createdAt
                                                    )}
                                                </td>


                                                {/* ORDER */}

                                                <td className="px-5 py-4">

                                                    {order?._id ? (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/client/orders/${order._id}`
                                                                )
                                                            }
                                                            className="text-sm font-semibold text-slate-900 hover:underline"
                                                        >
                                                            {order.clothingType ||
                                                                "Order"}
                                                        </button>

                                                    ) : (

                                                        <span className="text-sm text-slate-600">
                                                            Order
                                                        </span>

                                                    )}

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        #
                                                        {order?._id ||
                                                            payment.order ||
                                                            "-"}
                                                    </p>

                                                </td>


                                                {/* AMOUNT */}

                                                <td className="px-5 py-4 text-sm font-bold text-green-700">
                                                    {formatAmount(
                                                        payment.amount
                                                    )}
                                                </td>


                                                {/* METHOD */}

                                                <td className="px-5 py-4 text-sm text-slate-700">

                                                    {String(
                                                        payment.paymentMethod ||
                                                        "-"
                                                    ).replace(
                                                        /_/g,
                                                        " "
                                                    )}

                                                </td>


                                                {/* NOTES */}

                                                <td className="px-5 py-4 text-sm text-slate-500">
                                                    {payment.notes ||
                                                        "-"}
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default ClientPayments;