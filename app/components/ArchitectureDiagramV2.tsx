"use client";

import { useEffect, useRef, useState } from "react";
import { diagramConfig, DiagramNode } from "../config/diagram-config";

interface NodeCardProps {
  node: DiagramNode;
  className?: string;
  children?: React.ReactNode;
  nodeRef?: (el: HTMLAnchorElement | null) => void;
}

function NodeCard({ node, className = "", children, nodeRef }: NodeCardProps) {
  return (
    <a
      ref={nodeRef}
      href={node.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block rounded-lg border-2 p-3 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
      data-node-id={node.id}
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
    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow z-10">
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

interface Connection {
  from: string;
  to: string;
  color?: string;
}

export default function ArchitectureDiagramV2() {
  const config = diagramConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, DOMRect>>({});

  const connections: Connection[] = [
    // Application Layer to API Gateway
    { from: "mytma", to: "apigee", color: "#0ea5e9" },
    { from: "carenav", to: "apigee", color: "#0ea5e9" },
    { from: "benefits", to: "apigee", color: "#0ea5e9" },
    { from: "findcare", to: "apigee", color: "#0ea5e9" },
    { from: "provider", to: "apigee", color: "#0ea5e9" },

    // API Gateway to Middleware
    { from: "apigee", to: "onboarding", color: "#22c55e" },
    { from: "apigee", to: "intelligent-search", color: "#22c55e" },
    { from: "apigee", to: "agent-workflow", color: "#22c55e" },
    { from: "apigee", to: "smart-regression", color: "#22c55e" },
    { from: "apigee", to: "app-security", color: "#22c55e" },
    { from: "apigee", to: "developer-portal", color: "#22c55e" },
    { from: "apigee", to: "centralized-reporting", color: "#22c55e" },

    // Middleware to Backend connections
    { from: "onboarding", to: "kbs", color: "#a855f7" },
    { from: "intelligent-search", to: "kbs", color: "#a855f7" },
    { from: "intelligent-search", to: "kong", color: "#a855f7" },
    { from: "agent-workflow", to: "kong", color: "#a855f7" },
    { from: "smart-regression", to: "mcp-servers", color: "#a855f7" },
    { from: "app-security", to: "mcp-servers", color: "#a855f7" },
    { from: "developer-portal", to: "mcp-servers", color: "#a855f7" },
    { from: "centralized-reporting", to: "mcp-servers", color: "#a855f7" },

    // Cross-connections in middleware (horizontal)
    { from: "onboarding", to: "intelligent-search", color: "#10b981" },
    { from: "intelligent-search", to: "agent-workflow", color: "#10b981" },
    { from: "agent-workflow", to: "smart-regression", color: "#10b981" },
    { from: "smart-regression", to: "app-security", color: "#10b981" },
    { from: "app-security", to: "developer-portal", color: "#10b981" },
    { from: "developer-portal", to: "centralized-reporting", color: "#10b981" },
  ];

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;

      const positions: Record<string, DOMRect> = {};
      const nodes = containerRef.current.querySelectorAll("[data-node-id]");

      nodes.forEach((node) => {
        const id = node.getAttribute("data-node-id");
        if (id) {
          const rect = node.getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          positions[id] = new DOMRect(
            rect.x - containerRect.x,
            rect.y - containerRect.y,
            rect.width,
            rect.height
          );
        }
      });

      setNodePositions(positions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    setTimeout(updatePositions, 100);

    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  const drawArrow = (from: string, to: string, color: string = "#0ea5e9") => {
    const fromRect = nodePositions[from];
    const toRect = nodePositions[to];

    if (!fromRect || !toRect) return null;

    const fromX = fromRect.x + fromRect.width / 2;
    const fromY = fromRect.y + fromRect.height;
    const toX = toRect.x + toRect.width / 2;
    const toY = toRect.y;

    const isHorizontal = Math.abs(fromY - toY) < 50;
    const isAppToGateway = from.includes("MyTMA") || from.includes("carenav") || 
                          from.includes("benefits") || from.includes("findcare") || 
                          from.includes("provider");

    if (isHorizontal) {
      const startX = fromRect.x + fromRect.width;
      const startY = fromRect.y + fromRect.height / 2;
      const endX = toRect.x;
      const endY = toRect.y + toRect.height / 2;

      return (
        <g key={`${from}-${to}`}>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
            markerEnd="url(#arrowhead)"
          />
        </g>
      );
    }

    if (isAppToGateway && to === "apigee") {
      // Straight vertical lines from apps to gateway
      return (
        <g key={`${from}-${to}`}>
          <line
            x1={fromX}
            y1={fromY}
            x2={fromX}
            y2={toY - 20}
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1={fromX}
            y1={toY - 20}
            x2={toX}
            y2={toY - 20}
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1={toX}
            y1={toY - 20}
            x2={toX}
            y2={toY}
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
            markerEnd="url(#arrowhead)"
          />
        </g>
      );
    }

    const midY = (fromY + toY) / 2;
    const path = `M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}`;

    return (
      <g key={`${from}-${to}`}>
        <path
          d={path}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          markerEnd="url(#arrowhead)"
        />
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-slate-800">{config.title}</span>{" "}
            <span className="text-sky-600">{config.subtitle}</span>
          </h1>
        </div>

        <div
          ref={containerRef}
          className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          {/* SVG for connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#0ea5e9" opacity="0.6" />
              </marker>
            </defs>
            {connections.map((conn) => drawArrow(conn.from, conn.to, conn.color))}
          </svg>

          {/* Application Layer */}
          <div className="relative mb-8 pl-32 z-10">
            <LayerLabel>Application layer</LayerLabel>
            <div className="flex items-center justify-center gap-3">
              {config.applicationLayer.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  className="w-[140px] border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-50"
                />
              ))}
            </div>
          </div>

          {/* API Gateway */}
          <div className="relative mb-6 pl-32 z-10">
            <a
              href={config.apiGateway.url}
              target="_blank"
              rel="noopener noreferrer"
              data-node-id={config.apiGateway.id}
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

          {/* Middleware Layer */}
          <div className="relative mb-6 pl-32 z-10">
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
                          ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
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

          {/* Backend Layer */}
          <div className="relative pl-32 z-10">
            <LayerLabel>Backend</LayerLabel>
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6">
              <h3 className="mb-4 text-center text-lg font-semibold text-green-600">
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
                <div className="min-w-[150px] rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 p-3 text-center">
                  <div className="text-sm text-slate-400 font-medium">
                    + Add Service
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side connection line */}
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
            <div className="h-1 w-8 bg-sky-500" />
            <span>Data Flow</span>
          </div>
        </div>

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
