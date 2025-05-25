// src/components/Demos.tsx
import React from 'react';
import MQTTExplorer from './MQTTExplorer';

const Demos: React.FC = () => {
  return (
    <section
      id="demos"
      className="scroll-mt-24 pt-20 pb-20 px-6 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Demos
      </h2>
      <div className="w-20 h-1 bg-indigo-500 rounded mb-8" />

      {/* Demo: UNS Explorer */}
      <div className="mb-12">
        <MQTTExplorer />
      </div>

      {/* Future demos can go here */}
    </section>
  );
};

export default Demos;
