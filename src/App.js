import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";
import Home from "./page/home.jsx";
import StaffDashboard from "./page/BSS-Staff/Dashboard.jsx";
import TransactionManagement from "./page/BSS-Staff/TransactionManagement.jsx";
import StationManagement from "./page/BSS-Staff/StationManagement.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white">
              <Header />
              <Home />
              <Footer />
            </div>
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
  );
}

export default App;
