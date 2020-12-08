import path from 'path';
import fs from 'fs';

const PACKAGES_DIR = path.resolve(__dirname, '../../packages');
const APP_DIR = path.resolve(__dirname, '../../examples');

export function getPackages() {
  return [PACKAGES_DIR, APP_DIR]
    .flatMap((dir) =>
      fs.readdirSync(dir).map((file) => path.resolve(dir, file)),
    )
    .filter((f) => fs.lstatSync(path.resolve(f)).isDirectory());
}
