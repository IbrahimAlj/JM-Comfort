import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600">
          Tailwind is working 🎨
        </h1>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default App;
