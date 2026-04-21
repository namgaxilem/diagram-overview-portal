'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

interface MiddlewareNodeData {
  label: string;
  sublabel?: string;
  url: string;
  variant?: 'omw' | 'default' | 'portal' | 'reporting';
  hasWorkspace?: boolean;
  hasApi?: boolean;
}

export function MiddlewareNode({ data }: NodeProps) {
  const nodeData = data as unknown as MiddlewareNodeData;

  let bgClass = 'border-green-600 bg-green-600 hover:bg-green-700';
  if (nodeData.variant === 'omw') {
    bgClass = 'border-sky-600 bg-sky-600 hover:bg-sky-700';
  } else if (nodeData.variant === 'reporting') {
    bgClass = 'border-orange-500 bg-orange-500 hover:bg-orange-600';
  }

  return (
    <div className="relative">
      {/* API Tag */}
      {nodeData.hasApi !== false && (
        <div
          className={`absolute ${nodeData.variant === 'omw' ? '-bottom-3' : '-top-3'} left-1/2 -translate-x-1/2 z-20`}
        >
          <span className="rounded bg-white px-2 py-0.5 text-[9px] border border-purple-600 font-bold text-purple-600 shadow">
            APIs
          </span>
        </div>
      )}

      {nodeData.variant !== 'omw' && (
        <Handle type="target" position={Position.Top} className="!bg-sky-500 !w-2 !h-2" />
      )}
      {/* <Handle type="target" position={Position.Left} id="left" className="!bg-sky-500 !w-2 !h-2" /> */}
      <a
        href={nodeData.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`py-3 block w-[100px] min-h-[80px] rounded border-2 ${bgClass} text-white text-center p-2 transition-all duration-200 hover:scale-110 cursor-pointer shadow-md hover:shadow-lg`}
      >
        <div className="font-semibold text-xs leading-tight">{nodeData.label}</div>
        {nodeData.sublabel && (
          <div className="text-[10px] opacity-90 mt-1">{nodeData.sublabel}</div>
        )}
        {nodeData.hasWorkspace && <div className="mt-1 text-[9px] opacity-80">[workspace]</div>}
      </a>
      <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-2 !h-2" />
      {/* {nodeData.variant === "omw" && (
        <Handle type="source" position={Position.Right} id="right" className="!bg-sky-500 !w-2 !h-2" />
      )} */}
    </div>
  );
}
