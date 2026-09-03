import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createClient } from "../../api/clients.api";

const AddClient = () => {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    name: "",
    phone: "",
    email: "",
    password: "",

    address: "",
    gender: "",
    notes: "",
  });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // HANDLE CHANGE
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


    // ======================================
    // VALIDATION
    // ======================================

    if (!formData.name.trim()) {

      setError(
        "Client name is required."
      );

      return;
    }


    if (!formData.phone.trim()) {

      setError(
        "Phone number is required."
      );

      return;
    }


    if (!formData.email.trim()) {

      setError(
        "Client email is required because the client will use it to login."
      );

      return;
    }


    if (!formData.password) {

      setError(
        "Client password is required."
      );

      return;
    }


    if (formData.password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;
    }


    try {

      setLoading(true);


      // ======================================
      // CLIENT DATA
      // ======================================

      const clientData = {

        name:
          formData.name.trim(),

        phone:
          formData.phone.trim(),

        email:
          formData.email.trim(),

        password:
          formData.password,

        ...(formData.address.trim() && {
          address:
            formData.address.trim(),
        }),

        ...(formData.gender && {
          gender:
            formData.gender,
        }),

        ...(formData.notes.trim() && {
          notes:
            formData.notes.trim(),
        }),
      };


      console.log(
        "Creating client account:",
        clientData
      );


      // ======================================
      // API
      // ======================================

      const response =
        await createClient(
          clientData
        );


      console.log(
        "Create client response:",
        response
      );


      // ======================================
      // SUCCESS
      // ======================================

      setSuccess(
        "Client account created successfully."
      );


      // ======================================
      // REDIRECT
      // ======================================

      setTimeout(() => {

        navigate(
          "/tailor/clients"
        );

      }, 1000);

    } catch (err) {

      console.error(
        "Create client error:",
        err.response?.data ||
        err.message
      );


      setError(
        err.response?.data?.message ||
        "Failed to create client account."
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="mx-auto max-w-3xl">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/tailor/clients"
            )
          }
          className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Clients
        </button>


        <h1 className="text-2xl font-bold text-slate-900">
          Add New Client
        </h1>


        <p className="mt-1 text-sm text-slate-500">
          Create a client profile and login account.
        </p>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-800">
            {error}
          </p>

        </div>
      )}


      {/* ======================================
          SUCCESS
      ====================================== */}

      {success && (

        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">

          <p className="text-sm font-medium text-green-800">
            {success}
          </p>

        </div>
      )}


      {/* ======================================
          FORM
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-sm sm:p-8"
      >

        <div className="grid gap-5 sm:grid-cols-2">


          {/* NAME */}

          <div>

            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full Name *
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />

          </div>


          {/* PHONE */}

          <div>

            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phone *
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="03XXXXXXXXX"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Login Email *
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="client@example.com"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />

            <p className="mt-1 text-xs text-slate-500">
              Client will use this email to login.
            </p>

          </div>


          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Login Password *
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />

            <p className="mt-1 text-xs text-slate-500">
              Give this password to the client.
            </p>

          </div>


          {/* GENDER */}

          <div>

            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
            >

              <option value="">
                Select gender
              </option>

              <option value="MALE">
                Male
              </option>

              <option value="FEMALE">
                Female
              </option>

            </select>

          </div>


          {/* ADDRESS */}

          <div className="sm:col-span-2">

            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter client address"
              disabled={loading}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />

          </div>


          {/* NOTES */}

          <div className="sm:col-span-2">

            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional notes"
              disabled={loading}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />

          </div>

        </div>


        {/* ======================================
            BUTTONS
        ====================================== */}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/tailor/clients"
              )
            }
            disabled={loading}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Client Account"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddClient;