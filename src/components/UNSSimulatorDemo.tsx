import React from 'react';
import ImageCarousel from './common/ImageCarousel';
import sim1 from '../assets/uns-sim-1.png';
import sim2 from '../assets/uns-sim-2.png';
import sim3 from '../assets/uns-sim-3.png';
import sim4 from '../assets/uns-sim-4.png';
import sim5 from '../assets/uns-sim-5.png';

const images = [
  { src: sim1, alt: 'UNS Simulator Screenshot 1' },
  { src: sim2, alt: 'UNS Simulator Screenshot 2' },
  { src: sim3, alt: 'UNS Simulator Screenshot 3' },
  { src: sim4, alt: 'UNS Simulator Screenshot 4' },
  { src: sim5, alt: 'UNS Simulator Screenshot 5' },
];

const UNSSimulatorDemo: React.FC = () => {
  return <ImageCarousel images={images} />;
};

export default UNSSimulatorDemo;
