'use client';

import { useMemo } from 'react';
import { ReactFlow, Background, type Node, type Edge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { diagramConfig } from '../../config/diagram-config';
import {
  AppNode,
  GatewayNode,
  MiddlewareNode,
  BackendNode,
  LabelNode,
  BackendContainerNode,
} from './nodes';
import { FixedStepEdge } from './edges';

const nodeTypes = {
  appNode: AppNode,
  gatewayNode: GatewayNode,
  middlewareNode: MiddlewareNode,
  backendNode: BackendNode,
  labelNode: LabelNode,
  backendContainerNode: BackendContainerNode,
};

const edgeTypes = {
  fixedStep: FixedStepEdge,
};

const defaultEdgeOptions = {
  type: 'step',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#0ea5e9',
    width: 12,
    height: 12,
  },
  style: {
    stroke: '#0ea5e9',
    strokeWidth: 1.5,
  },
};

export default function DiagramFlow() {
  const config = diagramConfig;

  const nodes: Node[] = useMemo(() => {
    const nodeList: Node[] = [];

    // Layer labels (first column) - aligned for straight vertical lines
    nodeList.push({
      id: 'label-app',
      type: 'labelNode',
      position: { x: -5, y: 25 },
      data: { label: 'Application layer' },
      draggable: false,
    });
    nodeList.push({
      id: 'label-middleware',
      type: 'labelNode',
      position: { x: 10, y: 180 },
      data: { label: 'Middleware' },
      draggable: false,
    });
    nodeList.push({
      id: 'label-backend',
      type: 'labelNode',
      position: { x: 17, y: 400 },
      data: { label: 'Backend' },
      draggable: false,
    });

    // Application layer nodes
    const appStartX = 160;
    const appSpacing = 160;
    config.applicationLayer.forEach((app, index) => {
      nodeList.push({
        id: app.id,
        type: 'appNode',
        position: { x: appStartX + index * appSpacing, y: 10 },
        data: { label: app.label, sublabel: app.sublabel, url: app.url },
        draggable: false,
      });
    });

    // API Gateway - full width
    nodeList.push({
      id: config.apiGateway.id,
      type: 'gatewayNode',
      position: { x: 160, y: 95 },
      data: {
        label: config.apiGateway.label,
        sublabel: config.apiGateway.sublabel,
        url: config.apiGateway.url,
      },
      draggable: false,
    });

    // Middleware layer nodes
    const mwStartX = 130;
    const mwSpacing = 115;
    config.middlewareLayer.forEach((mw, index) => {
      const isOmw = index === 0;
      const isLast = index === config.middlewareLayer.length - 1;
      const isPortal = mw.id === 'developer-portal';

      let variant: 'omw' | 'default' | 'portal' | 'reporting' = 'default';
      if (isOmw) {
        variant = 'omw';
      } else if (isPortal) {
        variant = 'portal';
      } else if (isLast) {
        variant = 'reporting';
      }

      nodeList.push({
        id: mw.id,
        type: 'middlewareNode',
        position: { x: mwStartX + index * mwSpacing, y: 180 },
        data: {
          label: mw.label,
          sublabel: mw.sublabel,
          url: mw.url,
          variant,
          hasWorkspace: mw.hasWorkspace,
          // hasApi: !isOmw,
        },
        draggable: false,
      });
    });

    // Backend container
    nodeList.push({
      id: 'backend-container',
      type: 'backendContainerNode',
      position: { x: 130, y: 380 },
      data: { label: 'Enterprise Platform and Services' },
      draggable: false,
    });

    // Backend layer nodes
    const beStartX = 160;
    const beSpacing = 150;
    config.backendLayer.forEach((be, index) => {
      nodeList.push({
        id: be.id,
        type: 'backendNode',
        position: { x: beStartX + index * beSpacing, y: 420 },
        data: {
          label: be.label,
          sublabel: be.sublabel,
          url: be.url,
          variant: be.id,
        },
        draggable: false,
      });
    });

    return nodeList;
  }, [config]);

  const edges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];

    // Left column: Application layer -> Middleware (vertical dashed)
    edgeList.push({
      id: 'label-app-to-middleware',
      source: 'label-app',
      target: 'label-middleware',
      type: 'straight',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#0ea5e9',
      },
      style: { stroke: '#0ea5e9', strokeWidth: 1.5, strokeDasharray: '6,4' },
    });

    // Left column: Middleware -> Backend (vertical dashed)
    edgeList.push({
      id: 'label-middleware-to-backend',
      source: 'label-middleware',
      target: 'label-backend',
      type: 'straight',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#0ea5e9',
      },
      style: { stroke: '#0ea5e9', strokeWidth: 1.5, strokeDasharray: '6,4' },
    });

    // App nodes to API Gateway (arrows pointing DOWN to gateway)
    config.applicationLayer.forEach((app) => {
      edgeList.push({
        id: `${app.id}-to-gateway`,
        source: app.id,
        target: config.apiGateway.id,
        type: 'step',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#0ea5e9',
        },
        markerStart: {
          type: MarkerType.ArrowClosed,
          color: '#0ea5e9',
        },
        style: { stroke: '#0ea5e9', strokeWidth: 1.5 },
      });
    });

    // API Gateway to Middleware components (except OMW) - using fixedStep for single horizontal line
    config.middlewareLayer.forEach((mw) => {
      if (mw.id === 'onboarding') {
        return;
      }
      edgeList.push({
        id: `gateway-to-${mw.id}`,
        source: config.apiGateway.id,
        target: mw.id,
        type: 'fixedStep',
        data: { fixedY: 155 },
        markerEnd: undefined,
        markerStart: {
          type: MarkerType.ArrowClosed,
          color: '#0ea5e9',
        },
        style: { stroke: '#0ea5e9', strokeWidth: 1.5 },
      });
    });

    // Each middleware component (except OMW) to Backend container (dashed)
    config.middlewareLayer.forEach((mw) => {
      if (mw.id === 'onboarding') {
        return;
      }
      edgeList.push({
        id: `${mw.id}-to-backend`,
        source: mw.id,
        target: 'backend-container',
        type: 'fixedStep',
        data: { fixedY: 320 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#0ea5e9',
        },
        markerStart: {
          type: MarkerType.ArrowClosed,
          color: '#0ea5e9',
        },
        style: { stroke: '#0ea5e9', strokeWidth: 0.5 },
      });
    });

    // OMW to Backend container (dashed)
    edgeList.push({
      id: 'omw-to-backend',
      source: 'onboarding',
      target: 'backend-container',
      type: 'fixedStep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#0ea5e9',
      },
      style: { stroke: '#0ea5e9', strokeWidth: 2 },
    });

    return edgeList;
  }, [config]);

  return (
    <div className="w-full h-[580px] [&_.react-flow__node]:pointer-events-auto [&_.react-flow__node]:cursor-pointer">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={true}
        edgesFocusable={false}
        elementsSelectable={true}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#f1f5f9" gap={20} />
      </ReactFlow>
    </div>
  );
}
