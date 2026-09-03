import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ==========================================
  // GET USER ROLE
  // ==========================================

  const role = user?.role;

  // ==========================================
  // ROLE NOT AVAILABLE
  // ==========================================

  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // ROLE NOT ALLOWED
  // ==========================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    // Tailor always goes to Tailor Dashboard
    if (role === "TAILOR") {
      return (
        <Navigate
          to="/tailor/dashboard"
          replace
        />
      );
    }

    // Client always goes to Client Dashboard
    if (role === "CLIENT") {
      return (
        <Navigate
          to="/client/dashboard"
          replace
        />
      );
    }

    // Unknown role
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // ACCESS GRANTED
  // ==========================================

  return children;
};

export default ProtectedRoute;