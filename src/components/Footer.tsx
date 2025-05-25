import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f111a] border-t border-gray-700 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
        {/* Branding + Blurb */}
        <div className="text-center md:text-left">
          <p className="text-xl font-bold text-indigo-500">BD.</p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Building intuitive systems that unify OT & IT with real-time data.
          </p>
        </div>

        {/* Copyright + Stack */}
        <p className="text-center md:text-left text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Ben Duran · Built with React + Tailwind
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4 justify-center">
          <a
            href="https://github.com/benjamind10"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/YOUR_PROFILE"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:your.email@example.com"
            aria-label="Email"
            className="hover:text-indigo-500 transition"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
