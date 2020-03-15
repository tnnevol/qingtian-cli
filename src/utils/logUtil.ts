import logSymbols from 'log-symbols';
import chalk from 'chalk';
import yargs from 'yargs';

const error = (message: string, showHelp = false) => {
    if (showHelp) yargs.showHelp();
    console.log('\n', logSymbols.error, chalk.bold.red(message));
};

const warning = (message: string) => console.log('\n', logSymbols.warning, chalk.yellow(message));

const success = (message: string) => console.log('\n', logSymbols.success, chalk.green(message));

const info = (message: string) => console.log('\n', logSymbols.info, chalk.blue(message));

export default {
    error,
    warning,
    success,
    info
};
