export type SchemaType = 'openapi' | 'graphql' | 'jsonrpc';

export interface GenerationOptions {
  name: string;
  inputPath: string;
  outputDir: string;
  schemaType: SchemaType;
  emitOpenApiRuntime?: boolean;
}

export interface GeneratedResult {
  toolCount: number;
  tools: string[];
  serverFile: string;
  configFile: string;
}
