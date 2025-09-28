import React from "react";
import StaffSidebar from "./StaffSidebar";
import StaffHeader from "./StaffHeader";

const StaffLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col pl-64">
        {/* Header */}
        <StaffHeader />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default StaffLayout;
