import { CommandModule } from 'yargs';

import { correctProjectConfig } from '../utils/fileUtil';

const commandModule: CommandModule<{}, {}> = {
    command: 'check-config',
    describe: '检查 qt.config.ts 内容并修正',
    aliases: 'cc',
    handler: () => {
        correctProjectConfig(process.cwd());
    }
};

export const { command, describe, aliases, handler } = commandModule;
