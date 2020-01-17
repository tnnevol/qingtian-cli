import yargs from 'yargs';

yargs
    .commandDir('./commands')
    .demandCommand()
    .version()
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
