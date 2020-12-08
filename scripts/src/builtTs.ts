import path from 'path';
import fs from 'fs';
import execa from 'execa';
import chalk from 'chalk';
import { getPackages } from './builtUtils';

const packagesWithTs = getPackages().filter((p) =>
  fs.existsSync(path.resolve(p, 'tsconfig.json')),
);

const args = [
  '--max-old-space-size=4096',
  path.resolve(
    require.resolve('typescript/package.json'),
    '..',
    // eslint-disable-next-line global-require
    require('typescript/package.json').bin.tsc,
  ),
  '-b',
  ...packagesWithTs,
  ...process.argv.slice(2),
];

console.log(chalk.inverse('Building TypeScript definition files'));

try {
  execa.sync('node', args, { stdio: 'inherit' });
  console.log(
    chalk.inverse.green('Successfully built TypeScript definition files'),
  );
} catch (e) {
  console.error(
    chalk.inverse.red('Unable to build TypeScript definition files'),
  );
  console.error(e.stack);
  process.exitCode = 1;
}
