import React from 'react';

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="scroll-mt-24 min-h-screen px-6 pt-24 pb-12 flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-10"
    >
      {/* Left: Avatar */}
      <div className="flex justify-center md:justify-start">
        <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden bg-indigo-100 dark:bg-gray-800 shadow-lg flex items-center justify-center">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-4xl">
            BD
          </span>
        </div>
      </div>

      {/* Right: Text */}
      <div className="text-center md:text-left md:pl-8">
        <h2 className="text-indigo-600 text-sm font-mono mb-2">01. About Me</h2>
        <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Building Systems for the Real World
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          I'm a software engineer focused on industrial data systems, designing
          scalable architectures around the
          <span className="text-indigo-500 font-semibold">
            {' '}
            Unified Namespace (UNS)
          </span>
          . I specialize in Ignition Perspective, MQTT, and modern manufacturing
          tech stacks that bridge OT and IT.
        </p>

        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          My approach is simple: deliver{' '}
          <span className="font-semibold text-indigo-500">
            technology-first
          </span>{' '}
          solutions that generate real-world insight. Whether it’s integrating
          machine data, building interactive dashboards, or optimizing
          workflows, I care about clarity, scale, and sustainability.
        </p>
      </div>
    </section>
  );
};

export default About;
