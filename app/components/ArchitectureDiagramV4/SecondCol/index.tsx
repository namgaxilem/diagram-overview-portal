'use client';

import type { DiagramConfig } from '../../../config/diagram-config';
import AppLayer from '../AppLayer';
import MiddlewareLayer from '../MiddlewareLayer';
import BackendLayout from '../BackendLayout';

interface SecondColProps {
  config: DiagramConfig;
}

export default function SecondCol({ config }: SecondColProps) {
  return (
    <div className="flex flex-col flex-1">
      {/* Application Layer */}
      <AppLayer nodes={config.applicationLayer} apiGateway={config.apiGateway} />

      {/* Arrow transition from App to Middleware */}
      <div className="h-[40px]" />

      {/* Middleware Layer */}
      <MiddlewareLayer nodes={config.middlewareLayer} />

      {/* Arrow transition and OMW connection to Backend */}
      <div className="relative h-[40px]">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <marker
              id="arrowhead-to-backend"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#0ea5e9" />
            </marker>
          </defs>
          {/* OMW vertical line down to backend */}
          <line
            x1="7%"
            y1="0"
            x2="7%"
            y2="100%"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeDasharray="6,3"
            markerEnd="url(#arrowhead-to-backend)"
          />
        </svg>
      </div>

      {/* Backend Layer */}
      <BackendLayout nodes={config.backendLayer} />
    </div>
  );
}
