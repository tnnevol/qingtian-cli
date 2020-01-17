import { CommandModule } from 'yargs';

const commandModule: CommandModule<{}, { verbose: string }> = {
    command: 'add',
    describe: 'test add',
    aliases: 'a',
    builder: {
        verbose: {
            alias: 'p',
            type: 'string',
            description: 'test verbose',
            demandOption: true
        }
    },
    handler(args) {
        console.log(args.verbose);
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;
