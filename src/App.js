import "./App.css";
import "antd/dist/reset.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";

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
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route
            path="/transactions-management"
            element={<TransactionManagement />}
          />
          <Route path="/station-management" element={<StationManagement />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin-station-management"
            element={<AdminStationManagement />}
          />
          <Route
            path="/admin-user-management"
            element={<AdminUserManagement />}
          />
          <Route path="/admin-add-station" element={<AdminAddStation />} />
          <Route
            path="/admin-battery-dispatch"
            element={<AdminBatteryDispatch />}
          />
          <Route path="/admin-add-customer" element={<AdminAddCustomer />} />
          <Route path="/admin-add-staff" element={<AdminAddStaff />} />
          <Route
            path="/admin-battery-packages"
            element={<AdminPackManagement />}
          />
          <Route
            path="/admin-report-management"
            element={<AdminReportManagement />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
