// Configuration file for the DHP AI Experience Hub diagram
// Update the URLs below to link to your actual services

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  url: string;
  type: 'application' | 'gateway' | 'middleware' | 'backend';
  hasApi?: boolean;
  hasWorkspace?: boolean;
}

export interface DiagramConfig {
  title: string;
  subtitle: string;
  applicationLayer: DiagramNode[];
  apiGateway: DiagramNode;
  middlewareLayer: DiagramNode[];
  backendLayer: DiagramNode[];
}

export const diagramConfig: DiagramConfig = {
  title: "TMA",
  subtitle: "AI Experience Hub (AEH)",

  applicationLayer: [
    { id: "MyTMA", label: "MyTMA", url: "https://MyTMA.example.com", type: "application" },
    { id: "carenav", label: "CareNav", url: "https://carenav.example.com", type: "application" },
    { id: "benefits", label: "Benefits", url: "https://benefits.example.com", type: "application" },
    { id: "findcare", label: "FindCare", url: "https://findcare.example.com", type: "application" },
    { id: "provider", label: "Provider", url: "https://provider.example.com", type: "application" },
  ],

  apiGateway: {
    id: "apigee",
    label: "Enterprise API Gateway",
    sublabel: "ApiGee",
    url: "https://apigee.example.com",
    type: "gateway",
  },

  middlewareLayer: [
    {
      id: "onboarding",
      label: "Onboarding and Multi-tenant Workspace Management",
      url: "https://onboarding.example.com",
      type: "middleware",
      hasApi: true,
    },
    {
      id: "intelligent-search",
      label: "Intelligent Search",
      url: "https://intelligent-search.example.com",
      type: "middleware",
      hasWorkspace: true,
    },
    {
      id: "agent-workflow",
      label: "Agent & workflow management",
      url: "https://agent-workflow.example.com",
      type: "middleware",
      hasWorkspace: true,
    },
    {
      id: "smart-regression",
      label: "Smart Regression testing services",
      url: "https://smart-regression.example.com",
      type: "middleware",
      hasWorkspace: true,
    },
    {
      id: "app-security",
      label: "Application Security Automation",
      url: "https://app-security.example.com",
      type: "middleware",
      hasWorkspace: true,
    },
    {
      id: "developer-portal",
      label: "Developer Portal",
      url: "https://developer-portal.example.com",
      type: "middleware",
      hasWorkspace: true,
    },
    {
      id: "centralized-reporting",
      label: "Centralized Reporting",
      sublabel: "AI Evals",
      url: "https://centralized-reporting.example.com",
      type: "middleware",
      hasWorkspace: true,
    },
  ],

  backendLayer: [
    {
      id: "kbs",
      label: "KBS",
      sublabel: "Search Gateway",
      url: "https://kbs.example.com",
      type: "backend",
    },
    {
      id: "kong",
      label: "Kong",
      sublabel: "AI Gateway",
      url: "https://kong.example.com",
      type: "backend",
    },
    {
      id: "mcp-servers",
      label: "MCP Servers",
      sublabel: "data source",
      url: "https://mcp-servers.example.com",
      type: "backend",
    },
  ],
};
