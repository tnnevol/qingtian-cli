import Config from 'webpack-chain';
import program from 'commander';
import path from 'path';
import fs from 'fs-extra';

import { getProjectConfig } from './utils/configUtil';
import log from './utils/logUtil';

const packageJson = require('../package.json');

global.cliName = Object.keys(packageJson.bin)[0];
global.webpackConfig = new Config();
global.projectConfig = getProjectConfig();

async function init() {
    if (!!global.projectConfig.electron && !!global.projectConfig.nw) {
        return log.error(`不能同时存在 electron 和 nw 配置，请检查 ${global.cliName}.config.js`);
    }

    const commandPath = path.join(__dirname, 'commands');
    const commands = fs.readdirSync(commandPath);

    for (const c of commands) {
        const { default: registerCommand } = await import(`${commandPath}/${c}`);
        registerCommand(program);
    }

    program.parse(process.argv);
}

init();
