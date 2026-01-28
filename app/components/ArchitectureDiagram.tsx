"use client";

import { diagramConfig, DiagramNode } from "../config/diagram-config";

interface NodeCardProps {
  node: DiagramNode;
  className?: string;
  children?: React.ReactNode;
}

function NodeCard({ node, className = "", children }: NodeCardProps) {
  return (
    <a
      href={node.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block rounded-lg border-2 p-3 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
    >
      <div className="font-semibold text-sm leading-tight">{node.label}</div>
      {node.sublabel && (
        <div className="text-xs opacity-80 mt-1">({node.sublabel})</div>
      )}
      {children}
      <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}

function ApiTag() {
  return (
    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
      APIs
    </span>
  );
}

function WorkspaceTag() {
  return (
    <div className="mt-2 text-[10px] text-gray-500 font-medium">[workspace]</div>
  );
}

function LayerLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full">
      <span className="text-sm font-bold text-sky-600 whitespace-nowrap">
        {children}
      </span>
    </div>
  );
}

function ConnectionLine({ className }: { className: string }) {
  return <div className={`absolute bg-sky-400 ${className}`} />;
}

export default function ArchitectureDiagram() {
  const config = diagramConfig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-slate-800">{config.title}</span>{" "}
            <span className="text-sky-600">{config.subtitle}</span>
          </h1>
        </div>

        {/* Diagram Container */}
        <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          {/* Application Layer */}
          <div className="relative mb-6 pl-32">
            <LayerLabel>Application layer</LayerLabel>
            <div className="flex items-center justify-center gap-6">
              {config.applicationLayer.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  className="min-w-[120px] border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-50"
                />
              ))}
            </div>
          </div>

          {/* Connection arrows from apps to gateway */}
          <div className="relative h-8 mb-2">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-slate-300 to-sky-500" />
            <svg
              className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1"
              width="12"
              height="8"
              viewBox="0 0 12 8"
            >
              <path d="M6 8L0 0h12z" fill="#0ea5e9" />
            </svg>
          </div>

          {/* API Gateway */}
          <div className="relative mb-6 pl-32">
            <a
              href={config.apiGateway.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 p-4 text-center text-white shadow-lg transition-all duration-200 hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl"
            >
              <span className="font-bold text-lg">
                {config.apiGateway.label}
              </span>
              <span className="ml-2 text-sky-100">
                ({config.apiGateway.sublabel})
              </span>
            </a>
          </div>

          {/* Connection to Middleware */}
          <div className="relative h-8 mb-2">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-sky-500 to-green-500" />
            <svg
              className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1"
              width="12"
              height="8"
              viewBox="0 0 12 8"
            >
              <path d="M6 8L0 0h12z" fill="#22c55e" />
            </svg>
          </div>

          {/* Middleware Layer */}
          <div className="relative mb-6 pl-32">
            <LayerLabel>Middleware</LayerLabel>
            <div className="rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-6">
              <div className="flex flex-wrap items-start justify-center gap-4">
                {config.middlewareLayer.map((node) => (
                  <div key={node.id} className="relative">
                    {node.hasApi && <ApiTag />}
                    <NodeCard
                      node={node}
                      className={`min-w-[130px] max-w-[150px] ${
                        node.id === "onboarding"
                          ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                          : node.id === "centralized-reporting"
                          ? "border-sky-400 bg-sky-100 text-sky-800 hover:bg-sky-200"
                          : "border-green-500 bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {node.hasWorkspace && <WorkspaceTag />}
                    </NodeCard>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connection to Backend */}
          <div className="relative h-8 mb-2">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-green-400 to-purple-500" />
            <svg
              className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1"
              width="12"
              height="8"
              viewBox="0 0 12 8"
            >
              <path d="M6 8L0 0h12z" fill="#a855f7" />
            </svg>
          </div>

          {/* Backend Layer */}
          <div className="relative pl-32">
            <LayerLabel>Backend</LayerLabel>
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6">
              <h3 className="mb-4 text-center text-lg font-semibold text-amber-600 italic">
                Enterprise Platform and Services
              </h3>
              <div className="flex items-center justify-center gap-6">
                {config.backendLayer.map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    className={`min-w-[150px] ${
                      node.id === "kbs"
                        ? "border-purple-600 bg-purple-600 text-white hover:bg-purple-700"
                        : "border-sky-500 bg-sky-500 text-white hover:bg-sky-600"
                    }`}
                  />
                ))}
                {/* Empty placeholder box like in original diagram */}
                <div className="min-w-[150px] rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 p-3 text-center">
                  <div className="text-sm text-slate-400 font-medium">
                    + Add Service
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side connection lines (decorative) */}
          <div className="pointer-events-none absolute left-28 top-20 bottom-20 w-0.5 bg-gradient-to-b from-sky-200 via-sky-400 to-sky-200 opacity-50" />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border-2 border-slate-300 bg-white" />
            <span>Application</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gradient-to-r from-sky-500 to-cyan-500" />
            <span>API Gateway</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500" />
            <span>Middleware Service</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-purple-600" />
            <span>Backend Service</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              APIs
            </div>
            <span>Has API endpoints</span>
          </div>
        </div>

        {/* Instructions */}
        <p className="mt-4 text-center text-sm text-slate-500">
          Click on any component to navigate to its service. Configure URLs in{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">
            app/config/diagram-config.ts
          </code>
        </p>
      </div>
    </div>
  );
}
