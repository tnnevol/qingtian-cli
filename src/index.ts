import yargs from 'yargs';
import figlet from 'figlet';
import chalk from 'chalk';

console.log(figlet.textSync('hello world !', '3D-ASCII'));

yargs
    .commandDir('./commands')
    .demandCommand(1, chalk.red('必须提供至少一条命令'))
    .recommendCommands()
    .version()
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
