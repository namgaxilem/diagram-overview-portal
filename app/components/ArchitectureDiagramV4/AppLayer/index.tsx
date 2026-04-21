'use client';

import type { DiagramNode } from '../../../config/diagram-config';
import { NodeCard } from '../shared/NodeCard';

interface AppLayerProps {
  nodes: DiagramNode[];
  apiGateway: DiagramNode;
}

export default function AppLayer({ nodes, apiGateway }: AppLayerProps) {
  return (
    <div className="h-[120px] flex flex-col">
      {/* Application Components Row with individual vertical lines */}
      <div className="flex items-start justify-between px-12">
        {nodes.map((node, _index) => (
          <div key={node.id} className="flex flex-col items-center w-[100px]">
            <NodeCard
              node={node}
              className="w-[100px] h-[40px] flex items-center justify-center border-green-600 bg-green-600 text-white hover:bg-green-700"
            />
            {/* Vertical line with arrow pointing down */}
            <div className="w-[2px] h-[15px] bg-sky-500 mt-0" />
            <svg width="12" height="10" className="block">
              <polygon points="6 10, 0 0, 12 0" fill="#0ea5e9" />
            </svg>
          </div>
        ))}
      </div>

      {/* Horizontal bus line and center line to gateway */}
      <div className="relative h-[20px] mx-12">
        <div className="absolute top-0 left-[50px] right-[50px] h-[1px] bg-sky-500" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-sky-500" />
        <svg
          width="12"
          height="10"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full"
        >
          <polygon points="6 10, 0 0, 12 0" fill="#0ea5e9" />
        </svg>
      </div>

      {/* Enterprise API Gateway */}
      <a
        href={apiGateway.url}
        target="_blank"
        rel="noopener noreferrer"
        data-node-id={apiGateway.id}
        className="group block w-full rounded bg-gradient-to-r from-emerald-500 to-teal-500 py-2 px-4 text-center text-white shadow-md transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg"
      >
        <span className="font-semibold text-sm">{apiGateway.label}</span>
        <span className="ml-2 text-emerald-100 text-sm">
          (<span className="text-blue-200 underline">{apiGateway.sublabel}</span>)
        </span>
      </a>
    </div>
  );
}
