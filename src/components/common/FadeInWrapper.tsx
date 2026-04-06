import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: prefersReducedMotion ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInWrapper;
