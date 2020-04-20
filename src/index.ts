import yargs from 'yargs';
import chalk from 'chalk';
import Config from 'webpack-chain';
import logSymbols from 'log-symbols';

import { getProjectConfig } from './utils/configUtil';
import log from './utils/logUtil';

const packageJson = require('../package.json');

global.cliName = Object.keys(packageJson.bin)[0];
global.webpackConfig = new Config();
global.projectConfig = getProjectConfig();

function init() {
    if (!!global.projectConfig.electron && !!global.projectConfig.nw) {
        return log.error(`不能同时存在 electron 和 nw 配置，请检查 ${global.cliName}.config.js`);
    }

    yargs
        .scriptName(global.cliName)
        .commandDir('./commands')
        .demandCommand(1, logSymbols.error + ' ' + chalk.bold.red('必须提供至少一条命令'))
        .recommendCommands()
        .version()
        .alias('v', 'version')
        .help('h')
        .alias('h', 'help').argv;
}

init();
