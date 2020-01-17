import yargs from 'yargs';
import figlet from 'figlet';

console.log(figlet.textSync('hello world !', '3D-ASCII'));

yargs
    .commandDir('./commands')
    .demandCommand()
    .version()
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
