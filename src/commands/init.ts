import { CommandModule } from 'yargs';

const commandModule: CommandModule = {
    command: 'init',
    describe: 'test init',
    aliases: 'i',
    handler(args) {
        console.log(args);
    }
};

export const { command, describe, aliases, handler } = commandModule;
