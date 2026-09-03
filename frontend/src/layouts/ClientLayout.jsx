import { Outlet } from "react-router-dom";

import ClientSidebar from "../components/client/ClientSidebar";
import ClientNavbar from "../components/client/ClientNavbar";

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Client Sidebar */}
      <ClientSidebar />

      {/* Main Area */}
      <div className="lg:pl-64">

        {/* Client Navbar */}
        <ClientNavbar />

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default ClientLayout;