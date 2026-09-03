import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const TailorLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <div className="lg:pl-64">

        <Navbar />

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default TailorLayout;