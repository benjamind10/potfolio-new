import mqtt from 'mqtt';

const brokerUrl = import.meta.env.VITE_MQTTBROKER;

const client = mqtt.connect(brokerUrl, {
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

client.on('connect', () => {
  console.log('Connected to broker');
  client.subscribe('#'); // Wildcard to subscribe to all topics
});

client.on('message', (topic, payload) => {
  const message = payload.toString();
  console.log(`[${topic}] ${message}`);
});
