// src/components/Experience.tsx
import React from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const jobs = [
  {
    title: 'MES Engineer — Fortune Brands Innovations',
    dates: 'Jan 2025 – Present · Hybrid',
    desc: 'Developed, maintained, and supported MES applications to enhance operational efficiency and continuous improvement across facilities.',
    tags: 'Ignition, Industry 4.0, +5 skills',
  },
  {
    title: 'Software Engineer II — Fuuz',
    dates: 'Nov 2024 – Jan 2025 · Remote',
    desc: 'Delivered scalable MES solutions using Typescript, Fuuz App, and React.',
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
    </section>
  );
};

export default Experience;
