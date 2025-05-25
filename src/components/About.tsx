import React from 'react';
import { Download, GraduationCap, Briefcase, User } from 'lucide-react';
import { motion } from 'framer-motion';

const jobs = [
  {
    title: 'MES Engineer — Fortune Brands Innovations',
    dates: 'Jan 2025 – Present · Hybrid',
    desc: 'Developed, maintained, and supported MES applications to enhance operational efficiency and continuous improvement across facilities.',
    tags: 'Ignition, Industry 4.0, +5 skills',
  },
  {
    title: 'Software Engineer — Fuuz',
    dates: 'Nov 2024 – Jan 2025 · Remote',
    desc: 'Delivered scalable MES solutions using Ignition, UNS, and React.',
    tags: 'TypeScript, React.js, +1 skill',
  },
  {
    title: 'MI Solutions Specialist I — GPA',
    dates: 'Jan 2024 – Oct 2024 · Hybrid',
    desc: 'Built scalable application logic, databases, and maintainable interfaces for industrial data systems.',
    tags: 'Ignition, MQTT, +13 skills',
  },
  {
    title: 'Full Stack Developer — GPA',
    dates: 'Jul 2022 – Jan 2024',
    desc: 'Built custom MES software and Ignition solutions with deep backend logic in Node and Python.',
    tags: 'Software Development, Python, +9 skills',
  },
];

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="scroll-mt-24 pt-4 pb-20 px-6 max-w-6xl mx-auto"
    >
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        About Me
      </h2>
      <div className="w-20 h-1 bg-indigo-500 rounded mb-8"></div>

      {/* Bio */}
      <div className="mb-8 flex items-start gap-4">
        <User className="text-indigo-500 mt-1" />
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          I'm a software engineer focused on industrial systems. I specialize in
          Ignition Perspective, MQTT, and designing scalable architectures built
          on Unified Namespace (UNS).
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="md:col-span-8 space-y-6">
          {/* Education */}
          <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
            <div className="flex items-center gap-3 mb-2 text-indigo-500 font-semibold">
              <GraduationCap size={20} />
              <span>Education</span>
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">
              Self-Taught & MERN Bootcamp
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              University of Richmond · Full Stack Web Development Bootcamp
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Focused on JavaScript, Node.js, React, and MongoDB. Supplemented
              with years of hands-on experience and independent learning.
            </p>
          </div>

          {/* Experience Timeline */}
          <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
            <div className="flex items-center gap-3 mb-6 text-indigo-500 font-semibold">
              <Briefcase size={20} />
              <span>Experience</span>
            </div>

            <div className="relative border-l border-indigo-500/40 pl-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  className="relative mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute -left-3 top-1.5 w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-500">{job.dates}</p>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      {job.desc}
                    </p>
                    <p className="mt-1 text-indigo-500 text-sm font-medium">
                      {job.tags}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Avatar & Skills */}
        <div className="md:col-span-4 flex flex-col items-center justify-start gap-6">
          {/* Avatar */}
          <div className="w-36 h-36 rounded-full bg-gray-800 text-indigo-400 flex items-center justify-center text-3xl font-bold shadow">
            BD
          </div>

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
            {['Ignition', 'MQTT', 'MSSQL', 'UNS', 'TypeScript'].map(skill => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-sm text-indigo-600 dark:text-indigo-100 font-medium"
              >
                {skill}
              </span>
            ))}
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
