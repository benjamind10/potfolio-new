import React from 'react';
import { Download, GraduationCap, Briefcase, User } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="scroll-mt-24 pt-4 pb-20 px-6 max-w-6xl mx-auto"
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        About Me
      </h2>
      <div className="w-20 h-1 bg-indigo-500 rounded mb-8"></div>

      {/* Bio */}
      <div className="mb-8 flex items-start gap-4">
        <User className="text-indigo-500" />
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          I'm a software engineer focused on industrial systems. I specialize in
          Ignition Perspective, MQTT, and designing scalable architectures built
          on Unified Namespace (UNS).
        </p>
      </div>

      {/* Grid: Left = cards, Right = avatar/info */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Cards column */}
        <div className="md:col-span-8 space-y-6">
          {/* Education */}
          <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
            <div className="flex items-center gap-3 mb-2 text-indigo-500 font-semibold">
              <GraduationCap size={20} />
              <span>Education</span>
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">
              BS in Computer Engineering
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Some Engineering School — 2015–2019
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Focused on systems engineering, industrial networks, and
              automation technology.
            </p>
          </div>

          {/* Experience */}
          <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
            <div className="flex items-center gap-3 mb-2 text-indigo-500 font-semibold">
              <Briefcase size={20} />
              <span>Experience</span>
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">
              Senior Controls Engineer
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              FlexTech Industrial – 2020–Present
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Architecting full-stack MES systems using Ignition and UNS across
              multiple manufacturing sites.
            </p>
          </div>
        </div>

        {/* Profile + Tags column */}
        <div className="md:col-span-4 flex flex-col items-center justify-start gap-6">
          {/* Avatar */}
          <div className="w-36 h-36 rounded-full bg-gray-800 text-indigo-400 flex items-center justify-center text-3xl font-bold shadow">
            BD
          </div>

          {/* Name + Title */}
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Ben Duran
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Industry 4.0 Engineer
            </p>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Ignition', 'MQTT', 'MSSQL Server', 'UNS', 'TypeScript'].map(
              skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-sm text-indigo-600 dark:text-indigo-100 font-medium"
                >
                  {skill}
                </span>
              )
            )}
          </div>

          {/* Resume */}
          <a
            href="/resume.pdf"
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow transition"
            download
          >
            <Download size={16} className="mr-2" />
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
