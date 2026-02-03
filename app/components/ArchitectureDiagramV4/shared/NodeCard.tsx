"use client";

import { DiagramNode } from "../../../config/diagram-config";

interface NodeCardProps {
  node: DiagramNode;
  className?: string;
  children?: React.ReactNode;
  dataNodeId?: string;
}

export function NodeCard({ node, className = "", children, dataNodeId }: NodeCardProps) {
  return (
    <a
      href={node.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block rounded border-2 p-2 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
      data-node-id={dataNodeId || node.id}
    >
      <div className="font-semibold text-xs leading-tight">{node.label}</div>
      {node.sublabel && (
        <div className="text-[10px] opacity-90 mt-1">{node.sublabel}</div>
      )}
      {children}
    </a>
  );
}

export function ApiTagAbove() {
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
      <span className="rounded bg-orange-500 px-2 py-0.5 text-[9px] font-bold text-white shadow">
        APIs
      </span>
    </div>
  );
}

export function ApiTagBelow() {
  return (
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
      <span className="rounded bg-orange-500 px-2 py-0.5 text-[9px] font-bold text-white shadow">
        APIs
      </span>
    </div>
  );
}

export function WorkspaceTag() {
  return (
    <div className="mt-1 text-[9px] opacity-80">[workspace]</div>
  );
}
