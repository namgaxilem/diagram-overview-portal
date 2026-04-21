'use client';

interface FirstColProps {
  className?: string;
}

export default function FirstCol({ className = '' }: FirstColProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Application Layer Label - aligned with App Layer */}
      <div className="h-[120px] flex items-center">
        <span className="text-xs font-bold text-sky-600 whitespace-nowrap">Application layer</span>
      </div>

      {/* Arrow from Application to Middleware */}
      <div className="h-[40px] flex items-center justify-center">
        <svg width="24" height="40" viewBox="0 0 24 40">
          <defs>
            <marker
              id="arrowhead-down-1"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 8 4, 0 8" fill="#0ea5e9" />
            </marker>
          </defs>
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="32"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeDasharray="6,4"
            markerEnd="url(#arrowhead-down-1)"
          />
        </svg>
      </div>

      {/* Middleware Label - aligned with Middleware Layer */}
      <div className="h-[180px] flex items-center">
        <span className="text-xs font-bold text-sky-600 whitespace-nowrap">Middleware</span>
      </div>

      {/* Arrow from Middleware to Backend */}
      <div className="h-[40px] flex items-center justify-center">
        <svg width="24" height="40" viewBox="0 0 24 40">
          <defs>
            <marker
              id="arrowhead-down-2"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 8 4, 0 8" fill="#0ea5e9" />
            </marker>
          </defs>
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="32"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeDasharray="6,4"
            markerEnd="url(#arrowhead-down-2)"
          />
        </svg>
      </div>

      {/* Backend Label - aligned with Backend Layer */}
      <div className="h-[120px] flex items-center">
        <span className="text-xs font-bold text-sky-600 whitespace-nowrap">Backend</span>
      </div>
    </div>
  );
}
