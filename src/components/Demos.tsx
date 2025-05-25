import React, { useState } from 'react';
import MQTTExplorer from './MQTTExplorer';
// import LogSimulator from './LogSimulator';
import UNSExplorer from './UNSExplorer';

const TABS = [
  { key: 'uns', label: 'UNS Explorer', component: <UNSExplorer /> },
  { key: 'mqtt', label: 'MQTT Explorer', component: <MQTTExplorer /> },
  //   { key: 'logs', label: 'Log Simulator', component: <LogSimulator /> },
];

const Demos: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mqtt');

  const active = TABS.find(tab => tab.key === activeTab)?.component;

  return (
    <section
      id="demos"
      className="scroll-mt-24 pt-20 pb-20 px-6 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Demos
      </h2>
      <div className="w-20 h-1 bg-indigo-500 rounded mb-8" />

      {/* Tab headers */}
      <div className="flex space-x-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded font-medium text-sm transition ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active demo component */}
      <div>{active}</div>
    </section>
  );
};

export default Demos;
