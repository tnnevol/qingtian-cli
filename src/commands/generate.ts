import { CommandModule } from 'yargs';

import { createFile, FileType } from '../utils/fileUtil';

const commandModule: CommandModule<{}, { type: string; name: string; path: string | undefined }> = {
    command: 'generate <type> <name> [path]',
    describe: '代码生成',
    aliases: 'g <type>',
    builder: yargs => {
        return yargs
            .positional('type', {
                description: '代码类型',
                choices: ['hooks', 'component', 'slice'],
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
        createFile(args.type as FileType, args.name, args.path || '');
    }
};

export const { command, describe, aliases, builder, handler } = commandModule;
