import chalk from 'chalk';
import path from 'path';
import { existsSync } from 'fs-extra';
import { CommanderStatic } from 'commander';

const packageJson = require('../../package.json');
const packages = ['typescript', 'webpack'];
const namePad = ' '.repeat(packages.sort((a, b) => b.length - a.length)[0].length + 3);

function findUp(names: string | string[], from: string) {
    if (!Array.isArray(names)) {
        names = [names];
    }
    const root = path.parse(from).root;

    let currentDir = from;
    while (currentDir && currentDir !== root) {
        for (const name of names) {
            const p = path.join(currentDir, name);
            if (existsSync(p)) {
                return p;
            }
        }

        currentDir = path.dirname(currentDir);
    }

    return null;
}

function getPkgInfo(pkgs: string[]) {
    const obj: Record<string, { path: string; version: string }> = {};
    try {
        pkgs.forEach(p => {
            const maybePkg = findUp(p, path.join(__dirname, '..', '..')) as string;
            const json = require(path.resolve(maybePkg, 'package.json'));
            obj[p] = { path: maybePkg, version: json.version };
        });
    } catch (error) {}

    return obj;
}

export default function (program: CommanderStatic) {
    program.option('-i --info', '查看基本信息').action(() => {
        const infoMap = getPkgInfo(packages);

        console.log(
            chalk.green(
                `
Qingtian☀️  CLI: ${packageJson.version}
Node: ${process.versions.node}
OS: ${process.platform} ${process.arch}
typescript.tsdk: ${path.resolve(infoMap['typescript']?.path || '', 'lib')}

Package${namePad.slice(7)}Version
-------${namePad.replace(/ /g, '-')}------------------
${packages
    .map(module => `${module}${namePad.slice(module.length)}${infoMap[module]?.version}`)
    .sort()
    .join('\n')}
`
            )
        );
    });
}
