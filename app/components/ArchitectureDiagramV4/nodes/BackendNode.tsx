'use client';

import { type NodeProps } from '@xyflow/react';

interface BackendNodeData {
  label: string;
  sublabel?: string;
  url: string;
  variant?: 'kbs' | 'mcp-servers' | 'default';
}

export function BackendNode({ data }: NodeProps) {
  const nodeData = data as unknown as BackendNodeData;

  let bgClass = 'border-sky-500 bg-sky-500 hover:bg-sky-600';
  if (nodeData.variant === 'kbs') {
    bgClass = 'border-purple-600 bg-purple-600 hover:bg-purple-700';
  } else if (nodeData.variant === 'mcp-servers') {
    bgClass = 'border-blue-500 bg-blue-500 hover:bg-blue-700';
  }

  return (
    <div className="relative">
      {/* <Handle type="target" position={Position.Top} className="!bg-sky-500 !w-2 !h-2" /> */}
      <a
        href={nodeData.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-[130px] h-[55px] rounded border-2 ${bgClass} text-white text-center p-2 transition-all duration-200 hover:scale-110 cursor-pointer shadow-md hover:shadow-lg`}
      >
        <div className="font-semibold text-xs leading-tight">{nodeData.label}</div>
        {nodeData.sublabel && (
          <div className="text-[10px] opacity-90 mt-1">{nodeData.sublabel}</div>
        )}
      </a>
    </div>
  );
}
