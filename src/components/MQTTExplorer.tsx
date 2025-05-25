import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { cn } from '../utils/cn';

type MqttMessage = {
  topic: string;
  timestamp: string;
  payload: unknown;
};

const simulatedTopics = [
  'factory/line1/machineA/state',
  'factory/line1/machineB/infeed',
  'factory/line1/machineC/outfeed',
];

const sampleValues = ['RUNNING', 'STOPPED', 'IDLE', 'ERROR'];

function generateSimulatedMessage(): MqttMessage {
  const topic =
    simulatedTopics[Math.floor(Math.random() * simulatedTopics.length)];
  const value = sampleValues[Math.floor(Math.random() * sampleValues.length)];

  return {
    topic,
    timestamp: new Date().toISOString(),
    payload: {
      timestamp: new Date().toISOString(),
      value,
    },
  };
}

const MQTTExplorer: React.FC = () => {
  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(true);

  const VITE_MQTTBROKER = import.meta.env.VITE_MQTTBROKER;

  useEffect(() => {
    if (isSimulated) {
      const interval = window.setInterval(() => {
        const msg = generateSimulatedMessage();
        setMessages(prev => [...prev.slice(-49), msg]);
        setSelectedTopic(msg.topic);
      }, 2000);
      return () => window.clearInterval(interval);
    } else {
      const client = mqtt.connect(VITE_MQTTBROKER);
      client.on('connect', () => {
        client.subscribe('#', err => {
          if (err) console.error('Subscription error:', err);
        });
      });
      client.on('message', (topic, payload) => {
        try {
          const parsed = JSON.parse(payload.toString());
          const message: MqttMessage = {
            topic,
            timestamp: new Date().toISOString(),
            payload: parsed,
          };
          setMessages(prev => [...prev.slice(-49), message]);
          setSelectedTopic(topic);
        } catch (err) {
          console.error('Failed to parse payload:', err);
        }
      });
      return () => {
        client.end();
      };
    }
  }, [isSimulated, VITE_MQTTBROKER]);

  const uniqueTopics = Array.from(new Set(messages.map(m => m.topic))).sort();
  const current = messages.find(m => m.topic === selectedTopic);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20 pt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">MQTT Explorer</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Mode:
          <button
            onClick={() => setIsSimulated(!isSimulated)}
            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
          >
            {isSimulated ? 'Switch to Live' : 'Switch to Simulated'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        {/* Left: Topic list */}
        <div className="overflow-y-auto max-h-[400px] bg-black p-4 space-y-1 text-sm text-white font-mono">
          {uniqueTopics.length === 0 && (
            <p className="text-gray-500">No messages yet...</p>
          )}
          {uniqueTopics.map(topic => (
            <button
              key={topic}
              className={cn(
                'w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition',
                topic === selectedTopic && 'bg-gray-700 text-indigo-400'
              )}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Right: JSON view */}
        <div className="p-4 bg-gray-800 text-white text-sm font-mono overflow-x-auto">
          {current ? (
            <>
              <p className="text-xs text-indigo-400 mb-1">
                <span className="font-medium">Topic:</span> {current.topic}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                <span className="font-medium">Time:</span> {current.timestamp}
              </p>

              {typeof current.payload === 'object' &&
              current.payload !== null ? (
                <JsonView data={current.payload} />
              ) : (
                <p className="text-red-500 text-sm">Invalid or empty payload</p>
              )}
            </>
          ) : (
            <p className="text-gray-400">Select a topic to view the payload.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MQTTExplorer;
