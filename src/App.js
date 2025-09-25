import "./App.css";
import "antd/dist/reset.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";
import Home from "./page/home.jsx";
import Booking from "./page/EVDriver/booking.jsx";
import Login from "./page/auth/login.jsx";
import Register from "./page/auth/register.jsx";
import ForgotPassword from "./page/auth/forgot_password.jsx";
import StaffDashboard from "./page/BSS-Staff/Dashboard.jsx";
import TransactionManagement from "./page/BSS-Staff/TransactionManagement.jsx";
import StationManagement from "./page/BSS-Staff/StationManagement.jsx";
import BookingSuccess from "./page/EVDriver/bookingsuccess.jsx";

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
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route
            path="/transactions-management"
            element={<TransactionManagement />}
          />
          <Route path="/station-management" element={<StationManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
