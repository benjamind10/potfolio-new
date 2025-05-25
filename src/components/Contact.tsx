import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import FadeInWrapper from './common/FadeInWrapper';

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="scroll-mt-24 pt-4 pb-20 px-6 max-w-6xl mx-auto"
    >
      {/* Animated Title */}
      <FadeInWrapper>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Get In Touch
        </h2>
        <div className="w-20 h-1 bg-indigo-500 rounded mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
          Have a question or want to work together? Feel free to drop me a
          message. I’d love to hear from you!
        </p>
      </FadeInWrapper>

      {/* Layout */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Contact Info */}
        <FadeInWrapper yOffset={30}>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Fill out the form and I'll get back to you as soon as possible.
            </p>

            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <Mail className="text-indigo-500" size={16} />
                <span>ben.duran@proton.me</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-indigo-500" size={16} />
                <span>201.496.8838</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-indigo-500" size={16} />
                <span>Richmond, VA</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                Connect with me
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/benjamind10"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-gray-800 text-gray-200 hover:text-indigo-400 transition"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/benjamin-duran-3a880a1b9/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-gray-800 text-gray-200 hover:text-indigo-400 transition"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="mailto:ben.duran@proton.me"
                  className="p-2 rounded-full bg-gray-800 text-gray-200 hover:text-indigo-400 transition"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </FadeInWrapper>

        {/* Right: Contact Form */}
        <FadeInWrapper delay={0.2} yOffset={30}>
          <form className="p-6 rounded-xl border border-gray-700 bg-gray-900 space-y-4 shadow">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Subject
              </label>
              <input
                type="text"
                placeholder="Let's collaborate!"
                className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition"
            >
              <Send size={16} className="mr-2" />
              Send Message
            </button>
          </form>
        </FadeInWrapper>
      </div>
    </section>
  );
};

export default Contact;
