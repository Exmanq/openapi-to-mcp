#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateServer } from '../../generator/src/index.js';

const __filename = fileURLToPath(import.meta.url);

function usage(): string {
  return `openapi-to-mcp v0.1.0

Commands:
  openapi-to-mcp init --out <dir>
  openapi-to-mcp build --input <schema> --out <dir> --type <openapi|graphql|jsonrpc> --name <server-name> [--emit-openapi-runtime]
  openapi-to-mcp --version

Tips:
- Use --type to avoid wrong auto-detection.
- Use --emit-openapi-runtime to emit runtime defaults file.
`;
}

function getFlag(flag: string, args: string[]): string | undefined {
  const idx = args.indexOf(flag);
  return idx >= 0 ? args[idx + 1] : undefined;
}

async function cmdInit(args: string[]): Promise<void> {
  const out = getFlag('--out', args) ?? 'generated-mcp';
  await mkdir(out, { recursive: true });
  const starter = {
    name: 'my-generated-mcp',
    schemaType: 'openapi',
    input: 'schema.openapi.json',
    output: out
  };
  await writeFile(path.join(out, 'openapi-to-mcp.init.json'), JSON.stringify(starter, null, 2), 'utf8');
  console.log(`Initialized project scaffold at ${out}`);
}

async function cmdBuild(args: string[]): Promise<void> {
  const input = getFlag('--input', args);
  const out = getFlag('--out', args);
  const schemaType = getFlag('--type', args) as 'openapi' | 'graphql' | 'jsonrpc' | undefined;
  const name = getFlag('--name', args) ?? 'generated-mcp';
  const emitOpenApiRuntime = args.includes('--emit-openapi-runtime');

  if (!input || !out || !schemaType) {
    throw new Error('Missing required flags. Use build --input <schema> --out <dir> --type <openapi|graphql|jsonrpc>.');
  }

  const result = await generateServer({
    inputPath: input,
    outputDir: out,
    schemaType,
    name,
    emitOpenApiRuntime
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        command: 'build',
        input,
        out,
        schemaType,
        toolCount: result.toolCount,
        tools: result.tools
      },
      null,
      2
    )
  );
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help' || cmd === '-h') {
    console.log(usage());
    return;
  }

  if (cmd === '--version' || cmd === '-v') {
    console.log('0.1.0');
    return;
  }

  try {
    if (cmd === 'init') {
      await cmdInit(args.slice(1));
      return;
    }
    if (cmd === 'build') {
      await cmdBuild(args.slice(1));
      return;
    }

    throw new Error(`Unknown command: ${cmd}`);
  } catch (error) {
    const verbose = process.env.OPENAPI_TO_MCP_VERBOSE === '1';
    if (verbose) {
      console.error(error);
    } else {
      const msg = error instanceof Error ? error.message : 'Unexpected error';
      console.error(`${msg}\nTip: set OPENAPI_TO_MCP_VERBOSE=1 for full stack trace.`);
    }
    process.exit(1);
  }
}

if (process.argv[1] === __filename) {
  main();
}
