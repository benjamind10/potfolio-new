import React, { useEffect, useRef, useState } from 'react';

type LogEntry = {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
};

const LOG_LEVELS: LogEntry['level'][] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
const MESSAGES = [
  'Connected to PLC',
  'Heartbeat timeout',
  'Sensor read successful',
  'Write failed: register 40302',
  'Reconnecting to broker...',
  'Batch completed successfully',
  'Unexpected null reference',
  'Alarm reset by user',
  'Data published to UNS',
];

const generateLog = (): LogEntry => ({
  timestamp: new Date().toISOString(),
  level: LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)],
  message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
});

const LogSimulator: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, generateLog()];
        return next.slice(-100); // max 100 logs
      });

      // Scroll to bottom
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const levelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return 'text-blue-400';
      case 'WARN':
        return 'text-yellow-400';
      case 'ERROR':
        return 'text-red-400';
      case 'DEBUG':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-black text-white rounded-lg border border-gray-700 p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-3">Log Simulator</h3>
      <div
        ref={containerRef}
        className="max-h-[400px] overflow-y-auto text-sm font-mono space-y-1 bg-gray-900 p-3 rounded"
      >
        {logs.map((log, idx) => (
          <div key={idx} className="flex space-x-2">
            <span className="text-gray-500">{log.timestamp}</span>
            <span className={levelColor(log.level)}>[{log.level}]</span>
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogSimulator;
