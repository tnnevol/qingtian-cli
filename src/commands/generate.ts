import { CommandModule } from 'yargs';

const commandModule: CommandModule<{}, { type: string; name: string; path: string | undefined }> = {
    command: 'generate <type> <name> [path]',
    describe: '代码生成',
    aliases: 'g <type>',
    builder: yargs => {
        return yargs
            .positional('type', {
                description: '代码类型',
                choices: ['hooks', 'component', 'route'],
                demandOption: true
            })
            .positional('name', {
                description: '文件名称',
                type: 'string',
                demandOption: true
            })
            .positional('path', {
                type: 'string',
                description: '目标路径'
            });
    },
    handler: args => {
        console.log('\n类型：' + args.type);
        console.log('\n名称：' + args.name);
        console.log('\n路径：' + args.path);
    }
};

export const { command, describe, aliases, builder, handler } = commandModule;
