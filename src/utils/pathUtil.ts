import path from 'path';

import { isElectron } from './envUtil';

export function resolve(p: string) {
    return path.join(process.cwd(), p);
}

export function getBasePath() {
    return isElectron() ? './src/renderer/' : './src/';
}

export function getAssetPath(filename: string) {
    return path.join(__dirname, '..', 'assets', filename);
}
