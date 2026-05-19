export interface AuthConfig {
  enabled: boolean;
  methods: ('azure-ad' | 'api-key')[];
  azureAd: {
    tenantId: string;
    clientId: string;
    audience: string;
  };
  apiKey: {
    headerName: string;
  };
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  size: number;
  location: 'memory' | 'disk' | 'redis';
}

export interface ToolConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  code: string;
}

export interface FormData {
  type: 'local' | 'remote';
  name: string;
  owner: string;
  tools: ToolConfig[];
  isPublic: boolean;
  cacheConfig: CacheConfig;
  authenConfig: AuthConfig;
}

export interface McpServerOutput {
  type: 'local' | 'remote';
  name: string;
  owner: string;
  tools: Omit<ToolConfig, 'id'>[];
  isPublic: boolean;
  cacheConfig: CacheConfig;
  authenConfig: AuthConfig;
}
