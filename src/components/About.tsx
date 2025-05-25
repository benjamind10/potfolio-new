import React from 'react';
import { Download, User } from 'lucide-react';
import profilePic from '../assets/profile_pic.jpg';
import FadeInWrapper from './common/FadeInWrapper';

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="scroll-mt-24 pt-4 pb-20 px-6 max-w-6xl mx-auto"
    >
      {/* Section Title */}
      <FadeInWrapper>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          About Me
        </h2>
        <div className="w-20 h-1 bg-indigo-500 rounded mb-8" />
      </FadeInWrapper>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Avatar */}
        <FadeInWrapper yOffset={10}>
          <div className="w-36 h-36 rounded-full overflow-hidden shadow border-2 border-indigo-500">
            <img
              src={profilePic}
              alt="Ben Duran"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeInWrapper>

        {/* Bio + Skills + Resume */}
        <FadeInWrapper yOffset={20} delay={0.1}>
          <div>
            <div className="flex items-start gap-3 mb-4">
              <User className="text-indigo-500 mt-1" />
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                I'm a software engineer focused on industrial systems. I
                specialize in Ignition Perspective, MQTT, and scalable
                architectures built on the Unified Namespace (UNS).
              </p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Ignition', 'MQTT', 'MSSQL', 'UNS', 'TypeScript'].map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-sm text-indigo-600 dark:text-indigo-100 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Resume Button */}
            <a
              href="/resume.pdf"
              className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow transition"
              download
            >
              <Download size={16} className="mr-2" />
              Download Resume
            </a>
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
};

export default About;
