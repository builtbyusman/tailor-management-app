import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ClientSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/client/dashboard",
      icon: "📊",
    },
    {
      name: "My Orders",
      path: "/client/orders",
      icon: "🧵",
    },
    {
      name: "My Payments",
      path: "/client/payments",
      icon: "💰",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-slate-900 text-white lg:flex">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div>
          <h1 className="text-xl font-bold">
            👔 Tailor Management
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Client Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            {item.name}
          </NavLink>
        ))}

      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-600 hover:text-white"
        >
          <span>🚪</span>
          Logout
        </button>

      </div>

    </aside>
  );
};

export default ClientSidebar;