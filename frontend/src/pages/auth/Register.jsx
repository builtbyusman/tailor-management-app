import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword =
      formData.confirmPassword;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name) {
      setError("Name is required.");
      return;
    }

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your password."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    // ========================================
    // API REQUEST
    // ========================================

    try {
      setLoading(true);

      const registrationData = {
        name,
        email,
        password,
        role: "TAILOR",
      };

      console.log(
        "Registration data:",
        registrationData
      );

      const response =
        await registerUser(
          registrationData
        );

      console.log(
        "Registration response:",
        response
      );

      // ======================================
      // CHECK IF REGISTER API RETURNS TOKEN
      // ======================================

      const receivedToken =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken;

      const registeredUser =
        response?.user ||
        response?.data?.user;

      // ======================================
      // IF REGISTER ALSO LOGS USER IN
      // ======================================

      if (receivedToken) {
        const authData = login(response);

        const loggedInUser =
          authData?.user ||
          registeredUser;

        const loggedInRole =
          String(
            loggedInUser?.role ||
              "TAILOR"
          ).toUpperCase();

        if (
          loggedInRole === "TAILOR"
        ) {
          navigate(
            "/tailor/dashboard",
            {
              replace: true,
            }
          );

          return;
        }
      }

      // ======================================
      // NORMAL REGISTER
      // ======================================

      setSuccess(
        response?.message ||
          "Tailor account created successfully. Please login."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Go to login after short delay
      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-slate-900">
            Create Tailor Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register for Tailor Management
          </p>

        </div>


        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

          </div>
        )}


        {/* ====================================
            SUCCESS
        ==================================== */}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

            <p className="text-sm font-medium text-green-700">
              {success}
            </p>

          </div>
        )}


        {/* ====================================
            FORM
        ==================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* ==================================
              NAME
          ================================== */}

          <div>

            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

          </div>


          {/* ==================================
              EMAIL
          ================================== */}

          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

          </div>


          {/* ==================================
              PASSWORD
          ================================== */}

          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <p className="mt-1 text-xs text-slate-400">
              Minimum 6 characters
            </p>

          </div>


          {/* ==================================
              CONFIRM PASSWORD
          ================================== */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

          </div>


          {/* ==================================
              REGISTER BUTTON
          ================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Account..."
              : "Create Tailor Account"}
          </button>

        </form>


        {/* ====================================
            LOGIN LINK
        ==================================== */}

        <div className="mt-7 border-t border-slate-200 pt-6 text-center">

          <p className="text-sm text-slate-500">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            disabled={loading}
            className="mt-2 font-semibold text-slate-900 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Login here
          </button>

        </div>

      </div>

    </div>
  );
};

export default Register;