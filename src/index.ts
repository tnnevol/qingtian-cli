import yargs from 'yargs';
import chalk from 'chalk';
import Config from 'webpack-chain';

import { getProjectConfig } from './utils/configUtil';
// import figlet from 'figlet';
// console.log(figlet.textSync('hello world !', '3D-ASCII'));

global.webpackConfig = new Config();
global.projectConfig = getProjectConfig();

yargs
    .scriptName('qt')
    .commandDir('./commands')
    .demandCommand(1, chalk.red('必须提供至少一条命令'))
    .recommendCommands()
    .version()
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
