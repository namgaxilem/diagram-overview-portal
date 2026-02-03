"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

interface GatewayNodeData {
  label: string;
  sublabel?: string;
  url: string;
}

export function GatewayNode({ data }: NodeProps) {
  const nodeData = data as unknown as GatewayNodeData;
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-sky-500 !w-2 !h-2" />
      <a
        href={nodeData.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-[750px] rounded bg-gradient-to-r from-emerald-500 to-teal-500 py-2 px-4 text-center text-white shadow-md transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg"
      >
        <span className="font-semibold text-sm">{nodeData.label}</span>
        <span className="ml-2 text-emerald-100 text-sm">
          (<span className="text-blue-200 underline">{nodeData.sublabel}</span>)
        </span>
      </a>
      <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-2 !h-2" />
    </div>
  );
}
