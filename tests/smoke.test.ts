import { describe, expect, test } from 'vitest';
import { mkdtemp, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { generateServer } from '../packages/generator/src/index.js';

describe('openapi-to-mcp smoke', () => {
  test('generates server artifacts from OpenAPI schema', async () => {
    const temp = await mkdtemp(path.join(os.tmpdir(), 'openapi-to-mcp-'));
    const inputPath = path.join(process.cwd(), 'examples/minimal/petstore.openapi.json');
    const out = path.join(temp, 'generated');

    const result = await generateServer({
      inputPath,
      outputDir: out,
      schemaType: 'openapi',
      name: 'petstore-mcp',
      emitOpenApiRuntime: true
    });

    expect(result.toolCount).toBeGreaterThan(0);
    const config = JSON.parse(await readFile(path.join(out, 'mcp.config.json'), 'utf8'));
    expect(config.name).toBe('petstore-mcp');
  });
});
