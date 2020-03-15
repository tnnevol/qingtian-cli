import yargs from 'yargs';
import chalk from 'chalk';
import Config from 'webpack-chain';
import logSymbols from 'log-symbols';

import { getProjectConfig } from './utils/configUtil';
// import figlet from 'figlet';
// console.log(figlet.textSync('hello world !', '3D-ASCII'));
const packageJson = require('../package.json');

global.cliName = Object.keys(packageJson.bin)[0];
global.webpackConfig = new Config();
global.projectConfig = getProjectConfig();

yargs
    .scriptName(global.cliName)
    .commandDir('./commands')
    .demandCommand(1, logSymbols.error + ' ' + chalk.bold.red('必须提供至少一条命令'))
    .recommendCommands()
    .version()
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
