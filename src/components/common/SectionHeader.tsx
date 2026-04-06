import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className = '',
}) => (
  <div className={className}>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
      {title}
    </h2>
    <div
      className={`w-16 h-1 bg-indigo-500 rounded ${subtitle ? 'mb-4' : 'mb-8'}`}
    />
    {subtitle && (
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
