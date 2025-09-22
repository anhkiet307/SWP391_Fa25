import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";

// User pages
import Home from "./page/home.jsx";
import Login from "./page/auth/login.jsx";
import Register from "./page/auth/register.jsx";
import ForgotPassword from "./page/auth/forgot_password.jsx";

// Staff pages
import StaffDashboard from "./page/BSS-Staff/Dashboard.jsx";
import TransactionManagement from "./page/BSS-Staff/TransactionManagement.jsx";
import StationManagement from "./page/BSS-Staff/StationManagement.jsx";

// Admin pages
import AdminDashboard from "./page/BSS-Admin/Dashboard.jsx";
import AdminStationManagement from "./page/BSS-Admin/StationManagement.jsx";
import AdminUserManagement from "./page/BSS-Admin/UserManagement.jsx";
import AdminTransactionManagement from "./page/BSS-Admin/TransactionManagement.jsx";
import AdminReportManagement from "./page/BSS-Admin/ReportManagement.jsx";
import AdminAddStation from "./page/BSS-Admin/AddStation.jsx";
import AdminAddBattery from "./page/BSS-Admin/AddBattery.jsx";
import AdminManageBattery from "./page/BSS-Admin/ManageBattery.jsx";

// Layout component cho các trang có header và footer
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            }
          />
          {/* Staff Routes */}
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route
            path="/transactions-management"
            element={<TransactionManagement />}
          />
          <Route path="/station-management" element={<StationManagement />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-station-management" element={<AdminStationManagement />} />
          <Route path="/admin-user-management" element={<AdminUserManagement />} />
          <Route path="/admin-transaction-management" element={<AdminTransactionManagement />} />
          <Route path="/admin-report-management" element={<AdminReportManagement />} />
          <Route path="/admin-add-station" element={<AdminAddStation />} />
          <Route path="/admin-add-battery" element={<AdminAddBattery />} />
          <Route path="/admin-manage-battery" element={<AdminManageBattery />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
