import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
