import React from 'react';
import profiler1 from '../assets/script-profiler-1.png';
import profiler2 from '../assets/script-profiler-2.png';

const ScriptProfilerDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <img
        src={profiler1}
        alt="Script Profiler Screenshot 1"
        className="rounded shadow border border-gray-300 dark:border-gray-700"
      />
      <img
        src={profiler2}
        alt="Script Profiler Screenshot 2"
        className="rounded shadow border border-gray-300 dark:border-gray-700"
      />
    </div>
  );
};

export default ScriptProfilerDemo;
