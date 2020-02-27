import { CommandModule } from 'yargs';

const commandModule: CommandModule = {
    command: 'generate',
    describe: '生成代码文件',
    aliases: 'g',
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
