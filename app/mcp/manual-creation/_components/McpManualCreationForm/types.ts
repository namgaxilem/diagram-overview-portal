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

export interface AzureToolConfig {
  id: string;
  name: string;
  type: 'azure';
  indexName: string;
  description: string;
  params: string[];
}

export interface PythonToolConfig {
  id: string;
  name: string;
  type: 'python';
  description: string;
  code: string;
}

export type ToolConfig = AzureToolConfig | PythonToolConfig;

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
