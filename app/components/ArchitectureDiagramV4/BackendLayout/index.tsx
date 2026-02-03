"use client";

import { DiagramNode } from "../../../config/diagram-config";
import { NodeCard } from "../shared/NodeCard";

interface BackendLayerProps {
  nodes: DiagramNode[];
}

export default function BackendLayer({ nodes }: BackendLayerProps) {
  return (
    <div className="h-[120px] rounded-lg border-2 border-dashed border-sky-400 bg-slate-50/50 p-4">
      {/* Title */}
      <h3 className="mb-3 text-center text-base font-semibold italic text-emerald-600">
        Enterprise Platform and Services
      </h3>

      {/* Backend Components */}
      <div className="flex items-center justify-center gap-6">
        {nodes.map((node) => {
          let bgClass = "border-sky-500 bg-sky-500 text-white hover:bg-sky-600";
          if (node.id === "kbs") {
            bgClass = "border-purple-600 bg-purple-600 text-white hover:bg-purple-700";
          }

          return (
            <NodeCard
              key={node.id}
              node={node}
              className={`w-[140px] h-[55px] flex flex-col items-center justify-center ${bgClass}`}
            />
          );
        })}
      </div>
    </div>
  );
}
