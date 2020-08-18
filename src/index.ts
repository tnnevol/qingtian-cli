import yargs from 'yargs';
import Config from 'webpack-chain';
import { getProjectConfig } from './utils/configUtil';
import log from './utils/logUtil';

global.webpackConfig = new Config();
global.projectConfig = getProjectConfig();

function run() {
    const { electron, nw } = global.projectConfig;

    if (!!electron && !!nw)
        return log.error(
            'The electron and nw configurations cannot exist at the same time, please check the qt.config.js'
        );
    console.time('yargs');
    yargs
        .scriptName('qt')
        .detectLocale(false)
        .commandDir('./commands')
        .demandCommand(1)
        .recommendCommands()
        .version()
        .alias('v', 'version')
        .help('h')
        .alias('h', 'help').argv;
}

run();
