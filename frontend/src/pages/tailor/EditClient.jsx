import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
getClient,
updateClient,
} from "../../api/clients.api";

const EditClient = () => {
const { id } = useParams();
const navigate = useNavigate();

const [formData, setFormData] = useState({
name: "",
phone: "",
email: "",
address: "",
gender: "",
notes: "",
});

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

// ==========================================
// GET CLIENT
// ==========================================

useEffect(() => {
const fetchClient = async () => {
try {
setLoading(true);
setError("");


    const response = await getClient(id);

    const client = response?.client;

    if (!client) {
      throw new Error("Client not found");
    }

    setFormData({
      name: client.name || "",
      phone: client.phone || "",
      email: client.email || "",
      address: client.address || "",
      gender: client.gender || "",
      notes: client.notes || "",
    });

  } catch (err) {
    console.error(
      "Get client for edit error:",
      err.response?.data || err.message
    );

    setError(
      err.response?.data?.message ||
        "Failed to load client."
    );
  } finally {
    setLoading(false);
  }
};

if (id) {
  fetchClient();
}


}, [id]);

// ==========================================
// INPUT CHANGE
// ==========================================

const handleChange = (e) => {
const { name, value } = e.target;


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


if (!formData.name.trim()) {
  setError("Name is required.");
  return;
}

if (!formData.phone.trim()) {
  setError("Phone is required.");
  return;
}

try {
  setSaving(true);
  setError("");

  const updateData = {
    name: formData.name.trim(),
    phone: formData.phone.trim(),
    email: formData.email.trim(),
    address: formData.address.trim(),
    gender: formData.gender,
    notes: formData.notes.trim(),
  };

  console.log(
    "Updating client:",
    JSON.stringify(
      {
        id,
        ...updateData,
      },
      null,
      2
    )
  );

  const response = await updateClient(
    id,
    updateData
  );

  console.log(
    "Update client response:",
    JSON.stringify(response, null, 2)
  );

  navigate(
    `/tailor/clients/${id}`
  );

} catch (err) {
  console.error(
    "Update client error:",
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
      "Failed to update client."
  );
} finally {
  setSaving(false);
}


};

// ==========================================
// LOADING
// ==========================================

if (loading) {
return ( <div className="flex min-h-[400px] items-center justify-center"> <div className="text-center"> <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

      <p className="text-sm text-slate-500">
        Loading client...
      </p>
    </div>
  </div>
);

}

return ( <div className="mx-auto max-w-3xl space-y-6">


  {/* HEADER */}

  <div>
    <button
      type="button"
      onClick={() =>
        navigate(
          `/tailor/clients/${id}`
        )
      }
      className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
    >
      ← Back to Client
    </button>

    <h1 className="text-2xl font-bold text-slate-900">
      Edit Client
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Update client information.
    </p>
  </div>


  {/* ERROR */}

  {error && (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-medium text-red-800">
        {error}
      </p>
    </div>
  )}


  {/* FORM */}

  <form
    onSubmit={handleSubmit}
    className="rounded-xl bg-white p-6 shadow-sm"
  >

    <div className="grid gap-5 sm:grid-cols-2">

      {/* NAME */}

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name *
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter client name"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </div>


      {/* PHONE */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone *
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </div>


      {/* EMAIL */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </div>


      {/* GENDER */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Gender
        </label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
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

          <option value="OTHER">
            Other
          </option>
        </select>
      </div>


      {/* ADDRESS */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Address
        </label>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </div>


      {/* NOTES */}

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Notes
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={5}
          placeholder="Enter notes"
          className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </div>

    </div>


    {/* BUTTONS */}

    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

      <button
        type="button"
        onClick={() =>
          navigate(
            `/tailor/clients/${id}`
          )
        }
        disabled={saving}
        className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : "Save Changes"}
      </button>

    </div>

  </form>
</div>


);
};

export default EditClient;
