import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Footer from './components/Footer';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Demos from './components/Demos';

function App() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="space-y-32">
        <Hero />
        <About />
        <Experience />
        <Demos />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
