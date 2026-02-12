import fs from 'node:fs';

const checks = [
  ['node', () => Number(process.versions.node.split('.')[0]) >= 20, 'Node.js 20+ is required'],
  ['package.json', () => fs.existsSync('package.json'), 'package.json is missing'],
  ['examples', () => fs.existsSync('examples/minimal/petstore.openapi.json'), 'example schema missing']
];

let ok = true;
for (const [name, fn, err] of checks) {
  const pass = fn();
  console.log(`[doctor] ${name}: ${pass ? 'ok' : 'fail'}`);
  if (!pass) {
    console.error(`[doctor] ${err}`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log('[doctor] environment is healthy');
