export interface AuthConfig {
  enabled: boolean;
  azureAD: {
    enabled: boolean;
    groups: string[];
  };
  accessKey: {
    enabled: boolean;
    headerName: string;
    accessKeyValue: string;
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
