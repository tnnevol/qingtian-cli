import path from 'path';

export function resolve(p: string) {
    return path.join(process.cwd(), p);
}

export function getBasePath() {
    const isElectron = !!global.projectConfig.electron;
    return isElectron ? './src/renderer/' : './src/';
}
