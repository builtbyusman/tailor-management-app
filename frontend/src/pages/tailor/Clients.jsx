import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getClients,
  deleteClient,
} from "../../api/clients.api";

const Clients = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");


  // ==========================================
  // FETCH CLIENTS
  // ==========================================

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getClients();

      console.log(
        "Clients response:",
        JSON.stringify(response, null, 2)
      );

      setClients(response?.clients || []);

    } catch (err) {
      console.error(
        "Get clients error:",
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
          "Failed to load clients."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchClients();
  }, []);


  // ==========================================
  // DELETE CLIENT
  // ==========================================

  const handleDelete = async (client) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${client.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(client._id);
      setError("");

      const response = await deleteClient(
        client._id
      );

      console.log(
        "Delete client response:",
        JSON.stringify(response, null, 2)
      );

      // Remove from UI immediately
      setClients((prev) =>
        prev.filter(
          (item) => item._id !== client._id
        )
      );

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
      setDeletingId(null);
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredClients = clients.filter(
    (client) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        client.name
          ?.toLowerCase()
          .includes(searchText) ||

        client.phone
          ?.toLowerCase()
          .includes(searchText) ||

        client.email
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
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
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Clients
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your customers and their information.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/tailor/clients/add")
          }
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <span className="mr-2 text-lg">
            +
          </span>

          Add Client
        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-800">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchClients}
            className="text-sm font-semibold text-red-700 underline"
          >
            Retry
          </button>

        </div>
      )}


      {/* ======================================
          SEARCH + COUNT
      ====================================== */}

      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-md">

          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name, phone or email..."
            className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />

        </div>


        <div className="text-sm text-slate-500">

          Showing{" "}
          <span className="font-semibold text-slate-900">
            {filteredClients.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {clients.length}
          </span>{" "}
          clients

        </div>

      </div>


      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {clients.length === 0 ? (

        <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            👤
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            No clients yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            You haven't added any clients yet.
            Start by adding your first client.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/tailor/clients/add")
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add Your First Client
          </button>

        </div>

      ) : filteredClients.length === 0 ? (

        /* ====================================
           NO SEARCH RESULTS
        ==================================== */

        <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🔍
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            No clients found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try searching with a different name,
            phone number or email.
          </p>

        </div>

      ) : (

        /* ====================================
           CLIENT TABLE
        ==================================== */

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                    Email
                  </th>

                  <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
                    Gender
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredClients.map(
                  (client) => (

                    <tr
                      key={client._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* CLIENT */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                            {client.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "C"}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {client.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              Client
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* PHONE */}

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {client.phone || "-"}
                      </td>


                      {/* EMAIL */}

                      <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-slate-700 md:table-cell">
                        {client.email || "-"}
                      </td>


                      {/* GENDER */}

                      <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-slate-700 sm:table-cell">
                        {client.gender || "-"}
                      </td>


                      {/* ACTIONS */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/tailor/clients/${client._id}`
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            View
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/tailor/clients/${client._id}/edit`
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(client)
                            }
                            disabled={
                              deletingId ===
                              client._id
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            client._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default Clients;
