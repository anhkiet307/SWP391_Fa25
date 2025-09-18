import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";
import Home from "./page/home.jsx";
import Login from "./page/auth/login.jsx";
import Register from "./page/auth/register.jsx";
import ForgotPassword from "./page/auth/forgot_password.jsx";

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
