"use client";

import { diagramConfig } from "../../config/diagram-config";
import DiagramFlow from "./DiagramFlow";

export default function ArchitectureDiagramV4() {
  const config = diagramConfig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 overflow-x-auto">
      <div className="mx-auto min-w-[1100px] max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            <span className="text-slate-800">{config.title}</span>{" "}
            <span className="text-sky-600">{config.subtitle}</span>
          </h1>
        </div>

        {/* Diagram Container */}
        <div className="relative rounded-xl border border-slate-200 bg-white shadow-xl">
          <DiagramFlow />
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-[#1e5a7a]" />
            <span>Application</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            <span>API Gateway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-sky-600" />
            <span>OMW / Developer Portal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span>Reporting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-purple-600" />
            <span>Backend (KBS)</span>
          </div>
        </div>

        {/* <p className="mt-3 text-center text-xs text-slate-500">
          Click any component to open its service. Configure URLs in{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5">
            app/config/diagram-config.ts
          </code>
        </p> */}
      </div>
    </div>
  );
}
