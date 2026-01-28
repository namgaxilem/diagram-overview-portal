"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
      className={`group relative block rounded border-2 p-2 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
      data-node-id={node.id}
    >
      <div className="font-semibold text-xs leading-tight">{node.label}</div>
      {node.sublabel && (
        <div className="text-[10px] opacity-90 mt-1">{node.sublabel}</div>
      )}
      {children}
    </a>
  );
}

function ApiTagAbove() {
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
      <span className="rounded bg-orange-500 px-2 py-0.5 text-[9px] font-bold text-white shadow">
        APIs
      </span>
    </div>
  );
}

function ApiTagBelow() {
  return (
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
      <span className="rounded bg-orange-500 px-2 py-0.5 text-[9px] font-bold text-white shadow">
        APIs
      </span>
    </div>
  );
}

function WorkspaceTag() {
  return (
    <div className="mt-1 text-[9px] opacity-80">[workspace]</div>
  );
}

function LayerLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute left-4 ${className}`}>
      <span className="text-xs font-bold text-sky-600 whitespace-nowrap">
        {children}
      </span>
    </div>
  );
}

export default function ArchitectureDiagramV3() {
  const config = diagramConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, DOMRect>>({});

  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const newPositions: Record<string, DOMRect> = {};
    const nodes = containerRef.current.querySelectorAll("[data-node-id]");
    const containerRect = containerRef.current.getBoundingClientRect();

    nodes.forEach((node) => {
      const id = node.getAttribute("data-node-id");
      if (id) {
        const rect = node.getBoundingClientRect();
        newPositions[id] = new DOMRect(
          rect.x - containerRect.x,
          rect.y - containerRect.y,
          rect.width,
          rect.height
        );
      }
    });
    setPositions(newPositions);
  }, []);

  useEffect(() => {
    updatePositions();
    window.addEventListener("resize", updatePositions);
    const timer = setTimeout(updatePositions, 200);
    return () => {
      window.removeEventListener("resize", updatePositions);
      clearTimeout(timer);
    };
  }, [updatePositions]);

  const renderConnections = () => {
    const apps = ["MyTMA", "carenav", "benefits", "findcare", "provider"];
    const middleware = ["onboarding", "intelligent-search", "agent-workflow", "smart-regression", "app-security", "developer-portal", "centralized-reporting"];
    const backend = ["kbs", "kong", "mcp-servers"];

    const lines: React.ReactNode[] = [];
    const lineColor = "#0ea5e9";
    const lineWidth = 2;

    // Get positions
    const apigeePos = positions["apigee"];
    if (!apigeePos) return null;

    // 1. Application Layer to API Gateway - vertical lines down to a horizontal bus, then to gateway
    const appPositions = apps.map(id => positions[id]).filter(Boolean);
    if (appPositions.length === apps.length) {
      const busY = apigeePos.y - 15; // horizontal bus line position
      
      // Draw vertical lines from each app to the bus
      apps.forEach((appId, index) => {
        const appPos = positions[appId];
        if (appPos) {
          const x = appPos.x + appPos.width / 2;
          const startY = appPos.y + appPos.height;
          
          // Vertical line from app to bus
          lines.push(
            <line
              key={`app-${appId}-vertical`}
              x1={x}
              y1={startY}
              x2={x}
              y2={busY}
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
          );
        }
      });

      // Draw horizontal bus line connecting all vertical lines
      const leftApp = positions[apps[0]];
      const rightApp = positions[apps[apps.length - 1]];
      if (leftApp && rightApp) {
        lines.push(
          <line
            key="app-bus"
            x1={leftApp.x + leftApp.width / 2}
            y1={busY}
            x2={rightApp.x + rightApp.width / 2}
            y2={busY}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        );
      }

      // Draw single vertical line from bus center to API Gateway
      const gatewayCenterX = apigeePos.x + apigeePos.width / 2;
      lines.push(
        <line
          key="bus-to-gateway"
          x1={gatewayCenterX}
          y1={busY}
          x2={gatewayCenterX}
          y2={apigeePos.y}
          stroke={lineColor}
          strokeWidth={lineWidth}
          markerEnd="url(#arrowhead-blue)"
        />
      );
    }

    // 2. API Gateway to Middleware - vertical line down, then horizontal bus, then vertical to each
    const middlewarePositions = middleware.map(id => positions[id]).filter(Boolean);
    if (middlewarePositions.length > 0) {
      const gatewayBottomY = apigeePos.y + apigeePos.height;
      const firstMiddleware = positions[middleware[0]];
      
      if (firstMiddleware) {
        const busY = gatewayBottomY + (firstMiddleware.y - gatewayBottomY) / 2;
        const gatewayCenterX = apigeePos.x + apigeePos.width / 2;

        // Vertical line from gateway to bus
        lines.push(
          <line
            key="gateway-to-middleware-bus"
            x1={gatewayCenterX}
            y1={gatewayBottomY}
            x2={gatewayCenterX}
            y2={busY}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        );

        // Find leftmost and rightmost middleware
        let minX = Infinity, maxX = -Infinity;
        middleware.forEach(id => {
          const pos = positions[id];
          if (pos) {
            const centerX = pos.x + pos.width / 2;
            minX = Math.min(minX, centerX);
            maxX = Math.max(maxX, centerX);
          }
        });

        // Draw horizontal bus
        lines.push(
          <line
            key="middleware-bus"
            x1={minX}
            y1={busY}
            x2={maxX}
            y2={busY}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        );

        // Vertical lines to each middleware
        middleware.forEach(id => {
          const pos = positions[id];
          if (pos) {
            const x = pos.x + pos.width / 2;
            lines.push(
              <line
                key={`middleware-${id}-vertical`}
                x1={x}
                y1={busY}
                x2={x}
                y2={pos.y}
                stroke={lineColor}
                strokeWidth={lineWidth}
                markerEnd="url(#arrowhead-blue)"
              />
            );
          }
        });
      }
    }

    // 3. Middleware to Backend - similar pattern
    const backendPositions = backend.map(id => positions[id]).filter(Boolean);
    if (backendPositions.length > 0 && middlewarePositions.length > 0) {
      // Find bottom of middleware layer
      let middlewareBottomY = 0;
      middleware.forEach(id => {
        const pos = positions[id];
        if (pos) {
          middlewareBottomY = Math.max(middlewareBottomY, pos.y + pos.height);
        }
      });

      const firstBackend = positions[backend[0]];
      if (firstBackend) {
        const busY = middlewareBottomY + (firstBackend.y - middlewareBottomY) / 2;

        // Find leftmost and rightmost for both middleware and backend
        let minX = Infinity, maxX = -Infinity;
        
        // Check middleware positions
        middleware.forEach(id => {
          const pos = positions[id];
          if (pos) {
            const centerX = pos.x + pos.width / 2;
            minX = Math.min(minX, centerX);
            maxX = Math.max(maxX, centerX);
          }
        });

        // Check backend positions
        backend.forEach(id => {
          const pos = positions[id];
          if (pos) {
            const centerX = pos.x + pos.width / 2;
            minX = Math.min(minX, centerX);
            maxX = Math.max(maxX, centerX);
          }
        });

        // Draw vertical lines from middleware down to bus
        middleware.forEach(id => {
          const pos = positions[id];
          if (pos) {
            const x = pos.x + pos.width / 2;
            lines.push(
              <line
                key={`middleware-${id}-to-backend`}
                x1={x}
                y1={pos.y + pos.height}
                x2={x}
                y2={busY}
                stroke="#22c55e"
                strokeWidth={lineWidth}
              />
            );
          }
        });

        // Horizontal bus for backend connections
        lines.push(
          <line
            key="backend-bus"
            x1={minX}
            y1={busY}
            x2={maxX}
            y2={busY}
            stroke="#22c55e"
            strokeWidth={lineWidth}
          />
        );

        // Vertical lines to each backend service
        backend.forEach(id => {
          const pos = positions[id];
          if (pos) {
            const x = pos.x + pos.width / 2;
            lines.push(
              <line
                key={`backend-${id}-vertical`}
                x1={x}
                y1={busY}
                x2={x}
                y2={pos.y}
                stroke="#22c55e"
                strokeWidth={lineWidth}
                markerEnd="url(#arrowhead-green)"
              />
            );
          }
        });
      }
    }

    return lines;
  };

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
        <div
          ref={containerRef}
          className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        >
          {/* SVG for connections */}
          <svg
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <marker
                id="arrowhead-blue"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#0ea5e9" />
              </marker>
              <marker
                id="arrowhead-green"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Application Layer */}
          <div className="relative mb-12 ml-28 z-10">
            <LayerLabel className="top-1/2 -translate-y-1/2">Application layer</LayerLabel>
            <div className="flex items-center justify-center gap-4">
              {config.applicationLayer.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  className="w-[110px] h-[50px] flex items-center justify-center border-slate-400 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-50"
                />
              ))}
            </div>
          </div>

          {/* API Gateway */}
          <div className="relative mb-12 ml-28 z-10">
            <a
              href={config.apiGateway.url}
              target="_blank"
              rel="noopener noreferrer"
              data-node-id={config.apiGateway.id}
              className="group block w-full rounded bg-gradient-to-r from-emerald-500 to-teal-500 py-2 px-4 text-center text-white shadow-md transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg"
            >
              <span className="font-semibold text-sm">
                {config.apiGateway.label}
              </span>
              <span className="ml-2 text-emerald-100 text-sm">
                (<span className="text-blue-200 underline">{config.apiGateway.sublabel}</span>)
              </span>
            </a>
          </div>

          {/* Middleware Layer */}
          <div className="relative mb-12 ml-28 z-10">
            <LayerLabel className="top-1/2 -translate-y-1/2">Middleware</LayerLabel>
            <div className="rounded-lg border-2 border-dashed border-sky-400 bg-sky-50/30 p-4 pt-6">
              <div className="flex items-stretch justify-center gap-3">
                {config.middlewareLayer.map((node, index) => {
                  const isFirst = index === 0;
                  const isLast = index === config.middlewareLayer.length - 1;
                  const isDeveloperPortal = node.id === "developer-portal";
                  
                  let bgClass = "border-green-600 bg-green-600 text-white hover:bg-green-700";
                  if (isLast) {
                    bgClass = "border-orange-500 bg-orange-500 text-white hover:bg-orange-600";
                  } else if (isDeveloperPortal) {
                    bgClass = "border-sky-500 bg-sky-500 text-white hover:bg-sky-600";
                  }

                  return (
                    <div key={node.id} className="relative pt-2 pb-2">
                      {/* APIs tag - below for first, above for others */}
                      {isFirst ? (
                        <ApiTagBelow />
                      ) : (
                        <ApiTagAbove />
                      )}
                      <NodeCard
                        node={node}
                        className={`w-[115px] min-h-[70px] ${bgClass}`}
                      >
                        {node.hasWorkspace && <WorkspaceTag />}
                      </NodeCard>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Backend Layer */}
          <div className="relative ml-28 z-10">
            <LayerLabel className="top-6">Backend</LayerLabel>
            <div className="rounded-lg border-2 border-dashed border-slate-400 bg-slate-50/30 p-4">
              <h3 className="mb-4 text-center text-base font-semibold italic text-emerald-600">
                Enterprise Platform and Services
              </h3>
              <div className="flex items-center justify-center gap-6">
                {config.backendLayer.map((node) => {
                  let bgClass = "border-sky-500 bg-sky-500 text-white hover:bg-sky-600";
                  if (node.id === "kbs") {
                    bgClass = "border-purple-600 bg-purple-600 text-white hover:bg-purple-700";
                  }
                  
                  return (
                    <NodeCard
                      key={node.id}
                      node={node}
                      className={`w-[140px] h-[60px] flex flex-col items-center justify-center ${bgClass}`}
                    />
                  );
                })}
                {/* Empty placeholder */}
                <div className="w-[140px] h-[60px] rounded border-2 border-slate-300 bg-slate-100 flex items-center justify-center">
                  <span className="text-xs text-slate-400">+ Add Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left side vertical line decoration */}
          <div className="absolute left-24 top-16 bottom-16 w-0.5 bg-gradient-to-b from-sky-300 via-sky-500 to-sky-300" />
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-slate-400 bg-white" />
            <span>Application</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            <span>API Gateway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-green-600" />
            <span>Middleware</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span>Reporting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-purple-600" />
            <span>Backend</span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate-500">
          Click any component to open its service. Configure URLs in{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5">
            app/config/diagram-config.ts
          </code>
        </p>
      </div>
    </div>
  );
}
