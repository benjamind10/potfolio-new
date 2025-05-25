import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { unsTree } from '../data/unsTree';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const width = 600;
const height = 500;
const highlightInterval = 2000;

const NamespaceExplorer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    // Create the root hierarchy
    const rawRoot = d3.hierarchy<TreeNode>(unsTree);
    const treeLayout = d3.tree<TreeNode>().size([height - 60, width - 100]);
    const root = treeLayout(rawRoot); // This now has x and y (HierarchyPointNode)

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const g = svg.append('g').attr('transform', 'translate(50,30)');

    // Draw links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#555')
      .attr('stroke-width', 1.5)
      .attr('x1', d => d.source.y)
      .attr('y1', d => d.source.x)
      .attr('x2', d => d.target.y)
      .attr('y2', d => d.target.x);

    // Draw nodes
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    node
      .append('circle')
      .attr('r', 6)
      .attr('fill', d =>
        highlighted === getFullPath(d)
          ? '#4f46e5' // highlighted
          : '#9ca3af'
      )
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5);

    node
      .append('text')
      .attr('dy', 4)
      .attr('x', 10)
      .style('font-size', '0.75rem')
      .style('fill', '#e5e7eb')
      .text(d => d.data.name);

    // Highlight a random leaf node periodically
    const leafNodes = root.leaves();
    const interval = setInterval(() => {
      const randomLeaf =
        leafNodes[Math.floor(Math.random() * leafNodes.length)];
      const path = getFullPath(randomLeaf);
      setHighlighted(path);
    }, highlightInterval);

    return () => clearInterval(interval);
  }, [highlighted]);

  function getFullPath(d: d3.HierarchyPointNode<TreeNode>): string {
    return d
      .ancestors()
      .reverse()
      .map(n => n.data.name)
      .join('/');
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-2">
        Unified Namespace Explorer
      </h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-gray-800 rounded"
      />
    </div>
  );
};

export default NamespaceExplorer;
