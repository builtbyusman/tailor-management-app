import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMeasurement,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from "../../api/measurements.api";


// ==========================================
// INITIAL FORM
// ==========================================

const initialForm = {
  chest: "",
  waist: "",
  hip: "",
  shoulder: "",
  sleeveLength: "",
  shirtLength: "",
  neck: "",
  trouserWaist: "",
  trouserLength: "",
  thigh: "",
  knee: "",
  ankle: "",
  notes: "",
};


const ClientMeasurements = () => {
  const { id: clientId } = useParams();

  const navigate = useNavigate();


  const [measurement, setMeasurement] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // FETCH MEASUREMENT
  // ==========================================

  const fetchMeasurement = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMeasurement(clientId);

      console.log(
        "Measurement response:",
        JSON.stringify(
          response,
          null,
          2
        )
      );


      const data =
        response?.measurement ||
        response?.measurements ||
        null;


      setMeasurement(data);


      if (data) {
        setFormData({
          chest: data.chest ?? "",
          waist: data.waist ?? "",
          hip: data.hip ?? "",
          shoulder:
            data.shoulder ?? "",
          sleeveLength:
            data.sleeveLength ?? "",
          shirtLength:
            data.shirtLength ?? "",
          neck: data.neck ?? "",
          trouserWaist:
            data.trouserWaist ?? "",
          trouserLength:
            data.trouserLength ?? "",
          thigh: data.thigh ?? "",
          knee: data.knee ?? "",
          ankle: data.ankle ?? "",
          notes: data.notes ?? "",
        });
      }

    } catch (err) {

      console.error(
        "Get measurement error:",
        err.response?.data ||
          err.message
      );


      // Measurement does not exist yet
      if (
        err.response?.status === 404
      ) {
        setMeasurement(null);
        setError("");
        setFormData(initialForm);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load measurements."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (clientId) {
      fetchMeasurement();
    }
  }, [clientId]);


  // ==========================================
  // INPUT CHANGE
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
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    try {
      setSaving(true);


      // Remove empty fields
      const measurementData = {};

      Object.entries(formData).forEach(
        ([key, value]) => {

          if (
            value !== "" &&
            value !== null &&
            value !== undefined
          ) {
            measurementData[key] =
              key === "notes"
                ? value.trim()
                : Number(value);
          }
        }
      );


      // Notes should remain string
      if (formData.notes.trim()) {
        measurementData.notes =
          formData.notes.trim();
      }


      console.log(
        "Saving measurement:",
        JSON.stringify(
          measurementData,
          null,
          2
        )
      );


      let response;


      // ======================================
      // UPDATE
      // ======================================

      if (measurement) {

        response =
          await updateMeasurement(
            clientId,
            measurementData
          );

      }

      // ======================================
      // CREATE
      // ======================================

      else {

        response =
          await createMeasurement(
            clientId,
            measurementData
          );

      }


      console.log(
        "Measurement save response:",
        JSON.stringify(
          response,
          null,
          2
        )
      );


      setSuccess(
        response?.message ||
          "Measurements saved successfully."
      );


      // Refresh data
      await fetchMeasurement();


      setEditing(false);

    } catch (err) {

      console.error(
        "Save measurement error:",
        err.response?.data ||
          err.message
      );


      setError(
        err.response?.data?.message ||
          "Failed to save measurements."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete these measurements?"
      );


    if (!confirmed) {
      return;
    }


    try {
      setDeleting(true);
      setError("");
      setSuccess("");


      const response =
        await deleteMeasurement(
          clientId
        );


      console.log(
        "Delete measurement response:",
        JSON.stringify(
          response,
          null,
          2
        )
      );


      setMeasurement(null);
      setFormData(initialForm);


      setSuccess(
        response?.message ||
          "Measurements deleted successfully."
      );

    } catch (err) {

      console.error(
        "Delete measurement error:",
        err.response?.data ||
          err.message
      );


      setError(
        err.response?.data?.message ||
          "Failed to delete measurements."
      );

    } finally {
      setDeleting(false);
    }
  };


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {

    if (measurement) {

      setFormData({
        chest:
          measurement.chest ?? "",
        waist:
          measurement.waist ?? "",
        hip:
          measurement.hip ?? "",
        shoulder:
          measurement.shoulder ?? "",
        sleeveLength:
          measurement.sleeveLength ?? "",
        shirtLength:
          measurement.shirtLength ?? "",
        neck:
          measurement.neck ?? "",
        trouserWaist:
          measurement.trouserWaist ?? "",
        trouserLength:
          measurement.trouserLength ?? "",
        thigh:
          measurement.thigh ?? "",
        knee:
          measurement.knee ?? "",
        ankle:
          measurement.ankle ?? "",
        notes:
          measurement.notes ?? "",
      });

    } else {
      setFormData(initialForm);
    }


    setEditing(false);
    setError("");
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
            Loading measurements...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // MEASUREMENT DISPLAY
  // ==========================================

  const measurementFields = [
    ["chest", "Chest"],
    ["waist", "Waist"],
    ["hip", "Hip"],
    ["shoulder", "Shoulder"],
    ["sleeveLength", "Sleeve Length"],
    ["shirtLength", "Shirt Length"],
    ["neck", "Neck"],
    ["trouserWaist", "Trouser Waist"],
    ["trouserLength", "Trouser Length"],
    ["thigh", "Thigh"],
    ["knee", "Knee"],
    ["ankle", "Ankle"],
  ];


  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/tailor/clients/${clientId}`
            )
          }
          className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Client
        </button>


        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Client Measurements
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage tailoring measurements for this client.
            </p>

          </div>


          {measurement &&
            !editing && (
              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditing(true)
                  }
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Edit Measurements
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
            )}

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
          NO MEASUREMENT
      ====================================== */}

      {!measurement && !editing && (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
            📏
          </div>


          <h2 className="text-lg font-semibold text-slate-900">
            No measurements found
          </h2>


          <p className="mt-2 text-sm text-slate-500">
            Add measurements for this client to create their tailoring profile.
          </p>


          <button
            type="button"
            onClick={() =>
              setEditing(true)
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add Measurements
          </button>

        </div>
      )}


      {/* ======================================
          FORM
      ====================================== */}

      {(editing || !measurement) && (

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm sm:p-8"
        >

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              {measurement
                ? "Edit Measurements"
                : "Add Measurements"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter measurements according to your preferred unit.
            </p>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {measurementFields.map(
              ([field, label]) => (

                <div key={field}>

                  <label
                    htmlFor={field}
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {label}
                  </label>


                  <input
                    id={field}
                    type="number"
                    step="0.01"
                    min="0"
                    name={field}
                    value={
                      formData[field]
                    }
                    onChange={handleChange}
                    placeholder="0"
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
                  />

                </div>

              )
            )}

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
              placeholder="Measurement notes..."
              disabled={saving}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
            />

          </div>


          {/* BUTTONS */}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

            {measurement && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            )}


            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : measurement
                ? "Update Measurements"
                : "Save Measurements"}
            </button>

          </div>

        </form>
      )}


      {/* ======================================
          VIEW MEASUREMENTS
      ====================================== */}

      {measurement && !editing && (

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Current Measurements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Saved measurement details.
            </p>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {measurementFields.map(
              ([field, label]) => (

                <div
                  key={field}
                  className="rounded-lg bg-slate-50 p-4"
                >

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>


                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {measurement[field] !==
                      undefined &&
                    measurement[field] !==
                      null &&
                    measurement[field] !==
                      ""
                      ? measurement[field]
                      : "-"}
                  </p>

                </div>

              )
            )}

          </div>


          {measurement.notes && (
            <div className="mt-5 rounded-lg bg-slate-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                {measurement.notes}
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ClientMeasurements;
