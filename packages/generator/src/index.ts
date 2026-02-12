import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { runtimeTemplate, serverTemplate } from '../../templates/src/index.js';
import type { GeneratedResult, GenerationOptions } from './types.js';

interface ToolDef {
  name: string;
  method: string;
  path: string;
  description: string;
}

function parseInput(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return JSON.parse(raw);
  }
  return YAML.parse(raw);
}

function parseOpenApi(doc: any): ToolDef[] {
  const tools: ToolDef[] = [];
  const paths = doc?.paths ?? {};
  for (const [route, methods] of Object.entries<any>(paths)) {
    for (const [method, operation] of Object.entries<any>(methods ?? {})) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue;
      const opId = operation?.operationId ?? `${method}_${String(route).replace(/[^a-zA-Z0-9]/g, '_')}`;
      tools.push({
        name: opId,
        method: method.toUpperCase(),
        path: route,
        description: operation?.summary ?? operation?.description ?? 'Generated from OpenAPI'
      });
    }
  }
  return tools;
}

function parseJsonRpc(doc: any): ToolDef[] {
  const methods = doc?.methods ?? [];
  return methods.map((m: any) => ({
    name: m.name,
    method: 'JSONRPC',
    path: m.name,
    description: m.description ?? 'Generated from JSON-RPC'
  }));
}

function parseGraphql(schema: string): ToolDef[] {
  const tools: ToolDef[] = [];
  const regex = /(type\s+Query\s*\{([\s\S]*?)\})|(type\s+Mutation\s*\{([\s\S]*?)\})/g;
  for (const match of schema.matchAll(regex)) {
    const body = match[2] || match[4] || '';
    for (const line of body.split('\n')) {
      const clean = line.trim();
      if (!clean || clean.startsWith('#')) continue;
      const field = clean.split('(')[0].split(':')[0].trim();
      if (field) {
        tools.push({
          name: field,
          method: 'GRAPHQL',
          path: field,
          description: 'Generated from GraphQL schema'
        });
      }
    }
  }
  return tools;
}

function inferTypeFromPath(inputPath: string): 'openapi' | 'graphql' | 'jsonrpc' {
  const p = inputPath.toLowerCase();
  if (p.endsWith('.graphql') || p.endsWith('.gql')) return 'graphql';
  if (p.includes('jsonrpc') || p.endsWith('.rpc.json')) return 'jsonrpc';
  return 'openapi';
}

export async function generateServer(options: GenerationOptions): Promise<GeneratedResult> {
  const schemaType = options.schemaType ?? inferTypeFromPath(options.inputPath);
  const raw = await readFile(options.inputPath, 'utf8');

  let tools: ToolDef[] = [];
  if (schemaType === 'graphql') {
    tools = parseGraphql(raw);
  } else {
    const doc = parseInput(raw);
    tools = schemaType === 'jsonrpc' ? parseJsonRpc(doc) : parseOpenApi(doc);
  }

  if (tools.length === 0) {
    throw new Error('No operations found in schema. Check your input format and schema type.');
  }

  await mkdir(options.outputDir, { recursive: true });
  const serverFile = path.join(options.outputDir, 'server.mjs');
  const configFile = path.join(options.outputDir, 'mcp.config.json');

  await writeFile(
    serverFile,
    serverTemplate({ name: options.name, tools, useOpenApiRuntime: Boolean(options.emitOpenApiRuntime) }),
    'utf8'
  );

  await writeFile(
    configFile,
    JSON.stringify(
      {
        name: options.name,
        toolCount: tools.length,
        defaults: {
          authEnv: 'MCP_AUTH_TOKEN',
          rateLimitPerMinuteEnv: 'MCP_RATE_LIMIT_PER_MINUTE',
          logLevelEnv: 'MCP_LOG_LEVEL'
        }
      },
      null,
      2
    ),
    'utf8'
  );

  if (options.emitOpenApiRuntime) {
    await writeFile(path.join(options.outputDir, 'runtime.mjs'), runtimeTemplate(), 'utf8');
  }

  return { toolCount: tools.length, tools: tools.map((t) => t.name), serverFile, configFile };
}
