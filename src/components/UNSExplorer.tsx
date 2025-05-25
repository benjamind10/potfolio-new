import React, { useState } from 'react';
import { unsData } from '../data/unsData';

type UnsNode = {
  name: string;
  fullPath: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  children?: UnsNode[];
};

type NodeProps = {
  node: UnsNode;
  depth?: number;
};

const TreeNode: React.FC<NodeProps> = ({ node, depth = 0 }) => {
  const [expanded, setExpanded] = useState(true);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer flex items-start gap-1 text-sm font-mono text-white hover:text-indigo-400"
      >
        <span>{hasChildren ? (expanded ? '▼' : '▶') : '•'}</span>
        <span className="text-indigo-300">{node.name}</span>
        {node.payload && (
          <span className="ml-2 text-green-400 truncate max-w-[400px] whitespace-nowrap overflow-hidden text-ellipsis">
            = {JSON.stringify(node.payload)}
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children!.map(child => (
            <TreeNode key={child.fullPath} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const UNSExplorer: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-md mt-10">
      <h3 className="text-lg font-semibold text-white mb-4">
        Unified Namespace Explorer
      </h3>
      <div className="bg-black p-4 rounded overflow-y-auto max-h-[500px]">
        <TreeNode node={unsData} />
      </div>
    </section>
  );
};

export default UNSExplorer;
