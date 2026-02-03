"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

interface LabelNodeData {
  label: string;
}

export function LabelNode({ data }: NodeProps) {
  const nodeData = data as unknown as LabelNodeData;
  
  return (
    <div className="relative text-xs font-bold text-sky-600 whitespace-nowrap">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      {nodeData.label}
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  );
}
