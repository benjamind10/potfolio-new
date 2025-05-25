import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Mapp from './components/Mapp';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="space-y-32">
        <Hero />
        <About />
        <Mapp />
      </main>
      <Footer />
    </div>
  );
}

export default App;
