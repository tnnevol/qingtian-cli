export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

export function isElectron() {
    return !!global.projectConfig.electron;
}

export function isNW() {
    return !!global.projectConfig.nw;
}

export function isNotWebApp() {
    return isNW() || isElectron();
}
