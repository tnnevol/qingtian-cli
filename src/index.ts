import yargs from 'yargs';
import chalk from 'chalk';
import Config from 'webpack-chain';
import logSymbols from 'log-symbols';
import figlet from 'figlet';
import * as tsNode from 'ts-node';

import { getProjectConfig } from './utils/configUtil';

tsNode.register({ transpileOnly: true });

global.cliName = Object.keys(require('../package.json').bin)[0];
global.webpackConfig = new Config();
global.projectConfig = getProjectConfig();

console.log(
    chalk.green(
        figlet.textSync(`${global.cliName}-cli`, {
            font: 'ANSI Shadow'
        })
    )
);

yargs
    .scriptName(global.cliName)
    .commandDir('./commands')
    .demandCommand(1, logSymbols.error + ' ' + chalk.bold.red('必须提供至少一条命令'))
    .recommendCommands()
    .version()
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
