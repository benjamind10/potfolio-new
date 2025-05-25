import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';

function App() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="space-y-32">
        <Hero />
        <About />
      </main>
      {/* Toggle button to confirm visually */}
      <div className="fixed bottom-4 right-4 z-50"></div>
    </div>
  );
}

export default App;
