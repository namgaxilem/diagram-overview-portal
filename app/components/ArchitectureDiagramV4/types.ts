import { DiagramNode } from "../../config/diagram-config";

export interface LayerProps {
  nodes: DiagramNode[];
  className?: string;
}

export interface NodeCardProps {
  node: DiagramNode;
  className?: string;
  children?: React.ReactNode;
  showApiTag?: "above" | "below" | "none";
  showWorkspace?: boolean;
}

export type ConnectionType = "app-to-gateway" | "gateway-to-middleware" | "middleware-to-backend" | "omw-internal";
