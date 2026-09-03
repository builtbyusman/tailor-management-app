import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getClient,
  deleteClient,
} from "../../api/clients.api";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // FETCH CLIENT
  // ==========================================

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getClient(id);

      console.log(
        "Client details response:",
        JSON.stringify(response, null, 2)
      );

      setClient(response?.client || null);
    } catch (err) {
      console.error(
        "Get client details error:",
        JSON.stringify(
          err.response?.data || {
            message: err.message,
          },
          null,
          2
        )
      );

      setError(
        err.response?.data?.message ||
          "Failed to load client."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CLIENT
  // ==========================================

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  // ==========================================
  // DELETE CLIENT
  // ==========================================

  const handleDelete = async () => {
    if (!client) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${client.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await deleteClient(
        client._id
      );

      console.log(
        "Delete client response:",
        JSON.stringify(response, null, 2)
      );

      navigate("/tailor/clients");
    } catch (err) {
      console.error(
        "Delete client error:",
        JSON.stringify(
          err.response?.data || {
            message: err.message,
          },
          null,
          2
        )
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete client."
      );
    } finally {
      setDeleting(false);
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
            Loading client...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (error || !client) {
    return (
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            navigate("/tailor/clients")
          }
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Clients
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            Unable to load client
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error || "Client not found."}
          </p>

          <button
            type="button"
            onClick={fetchClient}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // CLIENT DETAILS
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/tailor/clients")
          }
          className="mb-4 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          ← Back to Clients
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* CLIENT NAME */}

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
              {client.name
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {client.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Client Details
              </p>
            </div>

          </div>

          {/* ACTIONS */}

          <div className="flex gap-2">

            {/* EDIT */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/tailor/clients/${client._id}/edit`
                )
              }
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit
            </button>

            {/* DELETE */}

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          CLIENT INFORMATION
      ====================================== */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Client Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about this client.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* NAME */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full Name
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {client.name || "-"}
            </p>
          </div>

          {/* PHONE */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phone
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {client.phone || "-"}
            </p>
          </div>

          {/* EMAIL */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </p>

            <p className="mt-1 break-all font-medium text-slate-900">
              {client.email || "-"}
            </p>
          </div>

          {/* GENDER */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Gender
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {client.gender || "-"}
            </p>
          </div>

          {/* ADDRESS */}

          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Address
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {client.address || "-"}
            </p>
          </div>

          {/* NOTES */}

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notes
            </p>

            <p className="mt-1 whitespace-pre-wrap font-medium text-slate-900">
              {client.notes || "-"}
            </p>
          </div>

          {/* CREATED DATE */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Added On
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {client.createdAt
                ? new Date(
                    client.createdAt
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

        </div>
      </div>

      {/* ======================================
          MEASUREMENTS
      ====================================== */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Measurements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage this client's tailoring measurements.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/tailor/clients/${client._id}/measurements`
              )
            }
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Measurements
          </button>

        </div>
      </div>

      {/* ======================================
          ORDERS
      ====================================== */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage orders for this client.
            </p>
          </div>

          {/* IMPORTANT:
              Selected client's ID is passed
              to the orders page.
          */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/tailor/orders?clientId=${client._id}`
              )
            }
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Orders
          </button>

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
              View payment history and payment details.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/tailor/payments?clientId=${client._id}`
              )
            }
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Payments
          </button>

        </div>
      </div>

    </div>
  );
};

export default ClientDetails;