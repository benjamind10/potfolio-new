// src/components/Experience.tsx
import React from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const jobs = [
  {
    title: 'MES Engineer — Fortune Brands Innovations',
    dates: 'Jan 2025 – Present · Hybrid',
    desc: 'Developed, maintained, and supported MES applications to enhance operational efficiency and continuous improvement across facilities.',
    tags: ['Ignition', 'Python', 'MQTT', 'MSSQL', 'UNS', 'Industry 4.0', 'MES'],
  },
  {
    title: 'Software Engineer II — Fuuz',
    dates: 'Nov 2024 – Jan 2025 · Remote',
    desc: 'Delivered scalable MES solutions using Typescript, Fuuz App, and React.',
    tags: ['TypeScript', 'React', 'JavaScript', 'MES', 'REST APIs'],
  },
  {
    title: 'MI Solutions Specialist I — GPA',
    dates: 'Jan 2024 – Oct 2024 · Hybrid',
    desc: 'Built scalable application logic, databases, and maintainable interfaces for industrial data systems.',
    tags: [
      'Ignition',
      'MQTT',
      'Python',
      'MSSQL',
      'UNS',
      'Node.js',
      'OPC-UA',
      'Historian',
      'SQL Server',
      'Perspective',
    ],
  },
  {
    title: 'Full Stack Developer — GPA',
    dates: 'Jul 2022 – Jan 2024',
    desc: 'Built custom MES software and Ignition solutions with deep backend logic in Node and Python.',
    tags: [
      'Python',
      'Node.js',
      'JavaScript',
      'Ignition',
      'SQL',
      'MES',
      'REST APIs',
      'Git',
      'Linux',
      'Docker',
    ],
  },
];
const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="scroll-mt-24 pt-4 pb-20 px-6 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Experience
      </h2>
      <div className="w-20 h-1 bg-indigo-500 rounded mb-8"></div>

      <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              <div className="absolute -left-3 top-1.5 w-3 h-3 bg-indigo-500 rounded-full ring-2 ring-indigo-500/20"></div>
              <div className="ml-4">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  {job.title}
                </h4>
                <p className="text-sm text-gray-500">{job.dates}</p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {job.desc}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 text-xs font-medium border border-indigo-700/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
