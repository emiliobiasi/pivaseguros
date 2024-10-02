import { SideBar } from "@/components/SideBar/side-bar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function SideBarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#f1efef] dark:bg-gray-900">
      <SideBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
