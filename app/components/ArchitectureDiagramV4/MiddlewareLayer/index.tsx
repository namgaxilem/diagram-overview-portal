'use client';

import type { DiagramNode } from '../../../config/diagram-config';
import { NodeCard, ApiTagAbove, ApiTagBelow, WorkspaceTag } from '../shared/NodeCard';

interface MiddlewareLayerProps {
  nodes: DiagramNode[];
}

export default function MiddlewareLayer({ nodes }: MiddlewareLayerProps) {
  // OMW is the first node, stands alone
  const omwNode = nodes[0];
  // Other middleware services connect via API Gateway
  const otherNodes = nodes.slice(1);

  return (
    <div className="h-[180px] flex flex-col">
      {/* Connection from API Gateway to Middleware (except OMW) */}
      <div className="relative h-[30px]">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <marker
              id="arrowhead-mid-down"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#0ea5e9" />
            </marker>
          </defs>
          {/* Center line from gateway */}
          <line x1="55%" y1="0" x2="55%" y2="40%" stroke="#0ea5e9" strokeWidth="1.5" />
          {/* Horizontal bus - not reaching OMW */}
          <line x1="22%" y1="40%" x2="95%" y2="40%" stroke="#0ea5e9" strokeWidth="1.5" />
          {/* Vertical lines down to each middleware component (except OMW) */}
          <line
            x1="22%"
            y1="40%"
            x2="22%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-mid-down)"
          />
          <line
            x1="34%"
            y1="40%"
            x2="34%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-mid-down)"
          />
          <line
            x1="47%"
            y1="40%"
            x2="47%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-mid-down)"
          />
          <line
            x1="59%"
            y1="40%"
            x2="59%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-mid-down)"
          />
          <line
            x1="72%"
            y1="40%"
            x2="72%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-mid-down)"
          />
          <line
            x1="84%"
            y1="40%"
            x2="84%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-mid-down)"
          />
          <line
            x1="95%"
            y1="40%"
            x2="95%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-mid-down)"
          />
        </svg>
      </div>

      {/* Middleware Components */}
      <div className="flex items-stretch gap-2 flex-1">
        {/* OMW - Standalone blue box */}
        <div className="relative pb-2 flex-shrink-0 w-[130px]">
          <NodeCard
            node={omwNode}
            className="w-full h-full border-sky-600 bg-sky-600 text-white hover:bg-sky-700"
          />
          <ApiTagBelow />
        </div>

        {/* Other Middleware Services */}
        {otherNodes.map((node, index) => {
          const isLast = index === otherNodes.length - 1;
          const isDeveloperPortal = node.id === 'developer-portal';

          let bgClass = 'border-green-600 bg-green-600 text-white hover:bg-green-700';
          if (isLast) {
            bgClass = 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600';
          } else if (isDeveloperPortal) {
            bgClass = 'border-sky-500 bg-sky-500 text-white hover:bg-sky-600';
          }

          return (
            <div key={node.id} className="relative pt-3 pb-2 flex-1">
              <ApiTagAbove />
              <NodeCard node={node} className={`h-full ${bgClass}`}>
                {node.hasWorkspace && <WorkspaceTag />}
              </NodeCard>
            </div>
          );
        })}
      </div>

      {/* OMW Connection Lines - horizontal to other middleware */}
      <div className="relative h-[20px]">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Horizontal dashed line from OMW to other middleware */}
          <line
            x1="7%"
            y1="50%"
            x2="95%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          {/* Connection points from each middleware to horizontal line */}
          <line
            x1="22%"
            y1="0"
            x2="22%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          <line
            x1="34%"
            y1="0"
            x2="34%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          <line
            x1="47%"
            y1="0"
            x2="47%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          <line
            x1="59%"
            y1="0"
            x2="59%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          <line
            x1="72%"
            y1="0"
            x2="72%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          <line
            x1="84%"
            y1="0"
            x2="84%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
          <line
            x1="95%"
            y1="0"
            x2="95%"
            y2="50%"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4,2"
          />
        </svg>
      </div>
    </div>
  );
}
