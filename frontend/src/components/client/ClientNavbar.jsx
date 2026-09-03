import { useAuth } from "../../context/AuthContext";

const ClientNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Client Panel
        </h2>

        <p className="hidden text-xs text-slate-500 sm:block">
          Manage your orders and payments
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "Client"}
          </p>

          <p className="text-xs text-slate-500">
            {user?.email || ""}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "C"}
        </div>

      </div>

    </header>
  );
};

export default ClientNavbar;