import React from 'react';
import ImageCarousel from './common/ImageCarousel';
import profiler1 from '../assets/script-profiler-1.png';
import profiler2 from '../assets/script-profiler-2.png';

const images = [
  { src: profiler1, alt: 'Script Profiler Screenshot 1' },
  { src: profiler2, alt: 'Script Profiler Screenshot 2' },
];

const ScriptProfilerDemo: React.FC = () => {
  return <ImageCarousel images={images} />;
};

export default ScriptProfilerDemo;
