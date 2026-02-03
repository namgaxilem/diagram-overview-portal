"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

interface BackendContainerNodeData {
  label: string;
}

export function BackendContainerNode({ data }: NodeProps) {
  const nodeData = data as unknown as BackendContainerNodeData;
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-sky-500 !w-2 !h-2 !left-[65px]" />
      <div className="w-[500px] h-[120px] rounded border-4 border-dashed border-sky-400 bg-slate-50/50 p-0">
        <h3 className="text-center text-base font-semibold italic text-emerald-600">
          {nodeData.label}
        </h3>
      </div>
    </div>
  );
}
