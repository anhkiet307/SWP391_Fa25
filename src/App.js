import "./App.css";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";
import Home from "./page/home.jsx";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
