import "./App.css";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Nội dung trang ở đây */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
