import fs from 'node:fs';

const minimalCfg = JSON.parse(fs.readFileSync('examples/output/generated-minimal/mcp.config.json', 'utf8'));
const advancedCfg = JSON.parse(fs.readFileSync('examples/output/generated-advanced/mcp.config.json', 'utf8'));

const summary = {
  generatedAt: new Date().toISOString(),
  minimal: minimalCfg,
  advanced: advancedCfg,
  outputs: [
    'examples/output/generated-minimal/server.mjs',
    'examples/output/generated-advanced/server.mjs'
  ]
};

fs.writeFileSync('examples/output/demo-summary.json', JSON.stringify(summary, null, 2));
console.log('[demo] wrote examples/output/demo-summary.json');
