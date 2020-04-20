import logSymbols from 'log-symbols';
import chalk from 'chalk';

const error = (message: string) => console.log(logSymbols.error, chalk.bold.red(message));

const warning = (message: string) => console.log(logSymbols.warning, chalk.yellow(message));

const success = (message: string) => console.log(logSymbols.success, chalk.green(message));

const info = (message: string) => console.log(logSymbols.info, chalk.blue(message));

export default {
    error,
    warning,
    success,
    info
};
