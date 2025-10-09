import "./App.css";
import "antd/dist/reset.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleBasedRedirect from "./components/RoleBasedRedirect.jsx";

// User pages
import Home from "./page/home.jsx";
import Booking from "./page/EVDriver/booking.jsx";
import Login from "./page/auth/login.jsx";
import Register from "./page/auth/register.jsx";
import ForgotPassword from "./page/auth/forgot_password.jsx";

// Staff pages
import StaffDashboard from "./page/BSS-Staff/Dashboard.jsx";
import TransactionManagement from "./page/BSS-Staff/TransactionManagement.jsx";
import StationManagement from "./page/BSS-Staff/StationManagement.jsx";
import BookingSuccess from "./page/EVDriver/bookingsuccess.jsx";
import BookingHistory from "./page/EVDriver/bookingHistory.jsx";
import Profile from "./page/profile.jsx";

// Admin pages
import AdminDashboard from "./page/BSS-Admin/homedashboard/Dashboard.jsx";
import AdminStationManagement from "./page/BSS-Admin/stationdashboard/StationManagement.jsx";
import AdminUserManagement from "./page/BSS-Admin/userdashboard/UserManagement.jsx";
import AdminAddStation from "./page/BSS-Admin/stationdashboard/AddStation.jsx";
import AdminBatteryDispatch from "./page/BSS-Admin/stationdashboard/BatteryDispatch.jsx";
import AdminAddCustomer from "./page/BSS-Admin/userdashboard/AddCustomer.jsx";
import AdminAddStaff from "./page/BSS-Admin/userdashboard/AddStaff.jsx";
import AdminPackManagement from "./page/BSS-Admin/userdashboard/PackManagement.jsx";
import AdminReportManagement from "./page/BSS-Admin/reportdashboard/ReportManagement.jsx";

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
          {/* Redirect route để xử lý refresh */}
          <Route path="/redirect" element={<RoleBasedRedirect />} />

          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route
            path="/booking-history"
            element={
              <MainLayout>
                <BookingHistory />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <Profile />
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
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute requiredRole="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions-management"
            element={
              <ProtectedRoute requiredRole="staff">
                <TransactionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/station-management"
            element={
              <ProtectedRoute requiredRole="staff">
                <StationManagement />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-station-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminStationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-user-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-add-station"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAddStation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-battery-dispatch"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminBatteryDispatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-add-customer"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAddCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-add-staff"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAddStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-battery-packages"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPackManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-report-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminReportManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
