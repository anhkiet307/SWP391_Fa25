import React from "react";
import StaffSidebar from "./StaffSidebar";

const StaffLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default StaffLayout;
