import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const mqttStates = ['RUNNING', 'STOPPED', 'IDLE', 'ERROR'];

const Hero: React.FC = () => {
  const [mqttState, setMqttState] = useState('RUNNING');

  useEffect(() => {
    const interval = setInterval(() => {
      const next = mqttStates[Math.floor(Math.random() * mqttStates.length)];
      setMqttState(next);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen px-6 pt-24 pb-12 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto"
    >
      {/* LEFT: Text */}
      <motion.div
        className="md:w-1/2 text-left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-indigo-500 text-sm font-mono mb-2">Hello! I'm</p>
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
          Ben{' '}
          <span className="text-indigo-600 dark:text-indigo-400">Duran</span>
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
          Industry 4.0 Software Engineer
        </h2>
        <p className="text-md text-gray-600 dark:text-gray-400 max-w-md mb-6">
          I specialize in building scalable systems around Unified Namespace
          (UNS), Ignition Perspective, and MQTT to unify industrial data.
        </p>
        <div className="flex gap-4">
          <a
            href="#demos"
            className="px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold text-sm shadow hover:bg-indigo-700 transition"
          >
            View Demos
          </a>
          <a
            href="#contact"
            className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-semibold text-sm shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Contact
          </a>
        </div>
      </motion.div>

      {/* RIGHT: MQTT Card */}
      <motion.div
        className="md:w-1/2 mt-12 md:mt-0 md:pl-10 flex justify-center"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        whileHover={{
          y: -4,
          scale: 1.01,
          transition: { type: 'spring', stiffness: 220, damping: 18 },
        }}
      >
        <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-[#0e0f1a] text-green-400 font-mono text-sm p-5 border border-gray-700 dark:border-gray-600">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-3 text-gray-400 text-xs">
            <div className="flex space-x-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <span>mqtt.log</span>
          </div>

          {/* Code block */}
          <pre className="whitespace-pre-wrap leading-relaxed">
            {`{
  "topic": "factory/line1/machineA/state",
  "payload": {
    "timestamp": "${new Date().toISOString()}",
    "value": "${mqttState}"
  }
}`}
          </pre>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
