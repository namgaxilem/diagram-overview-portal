'use client';

import type { EdgeProps } from '@xyflow/react';
import { BaseEdge } from '@xyflow/react';

interface FixedStepEdgeProps extends EdgeProps {
  data?: {
    fixedY?: number;
  };
}

export function FixedStepEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  markerStart,
  style,
  data,
}: FixedStepEdgeProps) {
  // Fixed Y position for the horizontal segment (between source and target)
  const fixedY = data?.fixedY ?? (sourceY + targetY) / 2;

  // Create path: source -> down to fixedY -> horizontal to targetX -> down to target
  const path = `M ${sourceX} ${sourceY} L ${sourceX} ${fixedY} L ${targetX} ${fixedY} L ${targetX} ${targetY}`;

  return (
    <BaseEdge id={id} path={path} markerEnd={markerEnd} markerStart={markerStart} style={style} />
  );
}
