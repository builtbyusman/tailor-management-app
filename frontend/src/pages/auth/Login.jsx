import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    user,
  } = useAuth();

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // REDIRECT ALREADY LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    if (!isAuthenticated || !user?.role) {
      return;
    }

    const role = String(user.role).toUpperCase();

    console.log(
      "Already authenticated user:",
      user
    );

    console.log(
      "Already authenticated role:",
      role
    );

    // ========================================
    // TAILOR
    // ========================================

    if (role === "TAILOR") {
      navigate("/tailor/dashboard", {
        replace: true,
      });

      return;
    }

    // ========================================
    // CLIENT
    // ========================================

    if (role === "CLIENT") {
      navigate("/client/dashboard", {
        replace: true,
      });

      return;
    }
  }, [
    isAuthenticated,
    user,
    navigate,
  ]);

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

    // Clear error while typing
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ========================================
    // VALIDATION
    // ========================================

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // LOGIN API
      // ======================================

      const response = await loginUser({
        email,
        password,
      });

      console.log(
        "Login API response:",
        response
      );

      // ======================================
      // SAVE LOGIN DATA
      // ======================================

      const authData = login(response);

      console.log(
        "Auth data:",
        authData
      );

      // ======================================
      // GET USER
      // ======================================

      const loggedInUser =
        authData?.user ||
        response?.user ||
        response?.data?.user;

      // ======================================
      // GET ROLE
      // ======================================

      const role = String(
        loggedInUser?.role ||
          response?.role ||
          response?.data?.role ||
          ""
      ).toUpperCase();

      console.log(
        "Logged-in user:",
        loggedInUser
      );

      console.log(
        "Logged-in role:",
        role
      );

      // ======================================
      // TAILOR
      // ======================================

      if (role === "TAILOR") {
        navigate(
          "/tailor/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      // ======================================
      // CLIENT
      // ======================================

      if (role === "CLIENT") {
        navigate(
          "/client/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      // ======================================
      // UNKNOWN ROLE
      // ======================================

      setError(
        "Login successful, but your account role could not be identified."
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      // ======================================
      // SERVER ERROR
      // ======================================

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please check your email and password.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-slate-900">
            Tailor Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to your account
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
            LOGIN FORM
        ==================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

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
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

          </div>


          {/* ==================================
              LOGIN BUTTON
          ================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* ====================================
            REGISTER SECTION
        ==================================== */}

        <div className="mt-7 border-t border-slate-200 pt-6 text-center">

          <p className="text-sm text-slate-500">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
            disabled={loading}
            className="mt-2 font-semibold text-slate-900 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create a new account
          </button>

        </div>

      </div>

    </div>
  );
};

export default Login;
