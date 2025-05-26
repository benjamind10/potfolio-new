import React, { useState } from 'react';
import { unsData } from '../data/unsData';
import type { UnsNode } from '../data/unsData';

const UNSExplorer: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (path: string) => {
    setExpanded(prev => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderNode = (node: UnsNode, depth = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded[node.fullPath] || false;

    return (
      <div
        key={node.fullPath}
        className="pl-4"
        style={{ marginLeft: depth * 16 }}
      >
        <div
          className="cursor-pointer select-none text-white hover:text-indigo-400"
          onClick={() => {
            if (hasChildren) toggleExpand(node.fullPath);
          }}
        >
          {hasChildren ? (
            <span className="mr-1">{isExpanded ? '▼' : '▶'}</span>
          ) : (
            <span className="mr-1">•</span>
          )}
          <span className="font-mono">{node.name}</span>
        </div>

        {/* Render children if expanded */}
        {isExpanded &&
          node.children?.map(child => renderNode(child, depth + 1))}

        {/* Show payload if it's a leaf node with data */}
        {node.payload && !hasChildren && (
          <pre className="bg-black text-green-400 text-xs mt-1 ml-6 p-2 rounded overflow-x-auto whitespace-pre-wrap">
            {typeof node.payload === 'object' && node.payload !== null
              ? JSON.stringify(node.payload as object, null, 2)
              : String(node.payload)}
          </pre>
        )}
      </div>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="border border-gray-700 bg-gray-900 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Unified Namespace Explorer
        </h3>
        <div className="bg-black rounded p-4 text-sm overflow-x-auto">
          {renderNode(unsData)}
        </div>
      </div>
    </section>
  );
};

export default UNSExplorer;
