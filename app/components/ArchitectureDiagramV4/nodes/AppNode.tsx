'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

interface AppNodeData {
  label: string;
  sublabel?: string;
  url: string;
}

export function AppNode({ data }: NodeProps) {
  const nodeData = data as unknown as AppNodeData;

  return (
    <div className="relative">
      <a
        href={nodeData.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block flex items-center justify-center w-[110px] h-[36px] rounded border-2 border-[#1e5a7a] bg-[#1e5a7a] text-white text-center p-1 transition-all duration-200 hover:bg-[#164a66] hover:scale-110 cursor-pointer shadow-md hover:shadow-lg"
      >
        <div className="font-semibold text-xs leading-tight">{nodeData.label}</div>
        {nodeData.sublabel && <div className="text-[10px] opacity-90">{nodeData.sublabel}</div>}
      </a>
      <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-2 !h-2" />
    </div>
  );
}
