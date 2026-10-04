import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/SideBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <Sidebar />

      <main className="min-h-screen pt-[76px] lg:ml-[250px]">
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;