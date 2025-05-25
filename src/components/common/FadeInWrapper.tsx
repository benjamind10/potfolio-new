import React from 'react';
import { motion } from 'framer-motion';

interface FadeInWrapperProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({
  children,
  delay = 0,
  yOffset = 20,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default FadeInWrapper;
