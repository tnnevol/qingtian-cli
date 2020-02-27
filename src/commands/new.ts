import { CommandModule } from 'yargs';

const commandModule: CommandModule = {
    command: 'new',
    describe: '生成项目模板',
    builder: {
        path: {
            type: 'string',
            alias: 'p',
            description: '指定生成的位置'
        }
    },
    handler: args => {
        console.log(args);
    }
};

export const { command, describe, aliases, handler, builder } = commandModule;
