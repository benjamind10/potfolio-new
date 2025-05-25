import React from 'react';
import { Link } from 'react-scroll';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();

  const links = [
    { name: 'About', to: 'about' },
    { name: 'Experience', to: 'experience' },
    { name: 'Demos', to: 'demos' },
    { name: 'Contact', to: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="hero"
          smooth={true}
          offset={-96}
          duration={500}
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
        >
          BD
        </Link>

        {/* Nav links */}
        <div className="flex items-center space-x-6">
          {links.map(({ name, to }) => (
            <Link
              key={name}
              to={to}
              smooth={true}
              offset={-96}
              duration={500}
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition"
              activeClass="text-indigo-600 dark:text-indigo-400 font-semibold"
              spy={true}
            >
              {name}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
